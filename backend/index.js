require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ตรวจสอบและสร้างโฟลเดอร์ uploads หากยังไม่มี
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// เปิดให้อ่านรูปผ่าน URL http://localhost:PORT/uploads/<filename>
app.use('/uploads', express.static(uploadDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      return cb(null, true);
    }
    cb(new Error('รองรับเฉพาะไฟล์รูปภาพ (jpg, jpeg, png, webp, gif) เท่านั้น'));
  }
});

// ==========================================
// API Routes
// ==========================================

// เช็คสถานะ API
app.get('/', (req, res) => {
  res.json({
    message: '🛒 Market Product API is running!',
    endpoints: {
      getProducts: 'GET /products',
      getProductById: 'GET /products/:id',
      createProduct: 'POST /products',
      updateProduct: 'PUT /products/:id',
      deleteProduct: 'DELETE /products/:id',
      uploadImage: 'POST /upload'
    }
  });
});

// อัปโหลดรูปภาพสินค้า
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'กรุณาแนบไฟล์รูปภาพ' });
  }
  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.status(200).json({
    url: fileUrl,
    filename: req.file.filename
  });
});

// ดึงรายการสินค้าทั้งหมด (รองรับ search query และ category filter)
app.get('/products', async (req, res) => {
  try {
    const { search, category } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { description: { contains: String(search) } }
      ];
    }

    if (category && category !== 'ทั้งหมด') {
      where.category = String(category);
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { id: 'desc' }
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลสินค้าได้' });
  }
});

// ดึงหมวดหมู่สินค้าทั้งหมดที่มีอยู่ในระบบ
app.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    });
    const list = categories.map((c) => c.category).filter(Boolean);
    res.json(list);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'ไม่สามารถดึงหมวดหมู่ได้' });
  }
});

// ดึงข้อมูลสินค้ารายชิ้นตาม ID
app.get('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'รหัสสินค้าไม่ถูกต้อง' });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'ไม่พบสินค้ารหัสนี้' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' });
  }
});

// เพิ่มสินค้าใหม่ (Create)
app.post('/products', async (req, res) => {
  const { name, description, price, category, stock, imageUrl } = req.body;

  if (!name || price === undefined || price === null || price === '') {
    return res.status(400).json({ error: 'กรุณากรอกชื่อสินค้าและราคา' });
  }

  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice < 0) {
    return res.status(400).json({ error: 'ราคาต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0' });
  }

  const numStock = stock !== undefined && stock !== '' ? parseInt(stock) : 0;

  try {
    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description ? description.trim() : null,
        price: numPrice,
        category: category && category.trim() ? category.trim() : 'ทั่วไป',
        stock: isNaN(numStock) ? 0 : numStock,
        imageUrl: imageUrl ? imageUrl.trim() : null
      }
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'ไม่สามารถเพิ่มสินค้าได้' });
  }
});

// แก้ไขสินค้า (Update)
app.put('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'รหัสสินค้าไม่ถูกต้อง' });
  }

  const { name, description, price, category, stock, imageUrl } = req.body;

  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (price !== undefined) {
      const numPrice = parseFloat(price);
      if (isNaN(numPrice) || numPrice < 0) {
        return res.status(400).json({ error: 'ราคาต้องเป็นตัวเลขที่ถูกต้อง' });
      }
      updateData.price = numPrice;
    }
    if (category !== undefined) {
      updateData.category = category && category.trim() ? category.trim() : 'ทั่วไป';
    }
    if (stock !== undefined) {
      const numStock = parseInt(stock);
      updateData.stock = isNaN(numStock) ? 0 : numStock;
    }
    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl ? imageUrl.trim() : null;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ error: 'แก้ไขสินค้าไม่สำเร็จ กรุณาตรวจสอบรหัสสินค้า' });
  }
});

// ลบสินค้า (Delete)
app.delete('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'รหัสสินค้าไม่ถูกต้อง' });
  }

  try {
    const deletedProduct = await prisma.product.delete({
      where: { id }
    });

    res.json({
      message: 'ลบสินค้าสำเร็จเรียบร้อยแล้ว',
      product: deletedProduct
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(400).json({ error: 'ลบสินค้าไม่สำเร็จ อาจไม่มีสินค้านี้ในระบบแล้ว' });
  }
});

// เริ่มต้นเปิด Server
app.listen(PORT, () => {
  console.log(`🚀 Market Backend Server is running at http://localhost:${PORT}`);
});
