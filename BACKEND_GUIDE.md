# ⚙️ คู่มือการปรับแต่ง Backend (Backend Guide)
> สำหรับผู้เริ่มต้น / ไม่เคยเขียน Node.js หรือ Express มาก่อน

Backend เปรียบเสมือน **"ครัวหลังร้าน"** ทำหน้าที่รับคำสั่งจากหน้าเว็บ (Frontend) ไปจัดการกับฐานข้อมูล (Database) แล้วส่งผลลัพธ์กลับไป

---

## 📍 ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
|---|---|
| `backend/index.js` | **หัวใจหลักของ Backend** บรรจุ Logic การทำงาน, API ทุกเส้น, และการอัปโหลดไฟล์ |
| `backend/.env` | ไฟล์ตั้งค่าสภาพแวดล้อม เช่น หมายเลข Port ของเซิร์ฟเวอร์ |
| `backend/uploads/` | โฟลเดอร์เก็บไฟล์รูปภาพที่ผู้ใช้กดอัปโหลดมาจากหน้าเว็บ |

---

## 1. วิธีเปลี่ยน Port ของ Backend

ถ้าต้องการเปลี่ยน Port ของ Backend (ปัจจุบันคือ `5000`):

1. เปิดไฟล์ `backend/.env`
2. แก้ไขบรรทัดแรก:
   ```env
   PORT=8000
   ```
3. *(อย่าลืม)* ไปแก้ใน `frontend/.env.local` ให้ชี้มาที่ Port ใหม่ด้วย เช่น `NEXT_PUBLIC_API_URL=http://localhost:8000`

---

## 2. โครงสร้างของ `backend/index.js` (แต่ละส่วนทำหน้าที่อะไร)

เปิดไฟล์ `backend/index.js` จะแบ่งออกเป็นส่วนหลักๆ ดังนี้:

| บรรทัดประมาณ | ส่วนงาน | รายละเอียด |
|---|---|---|
| 1 - 20 | **การนำเข้าไลบรารี & การตั้งค่าเริ่มต้น** | เรียกใช้ express, cors, prisma, multer |
| 21 - 48 | **ระบบอัปโหลดไฟล์ (Multer)** | กำหนดโฟลเดอร์เก็บรูป และตรวจสอบชนิดไฟล์รูปภาพ |
| 54 - 66 | **Endpoint เช็คสถานะ API (`GET /`)** | หน้าแรกของ backend ไว้ทดสอบว่าเซิร์ฟเวอร์เปิดอยู่ |
| 69 - 78 | **Endpoint อัปโหลดรูปภาพ (`POST /upload`)** | รับไฟล์รูปภาพแล้วสร้าง URL ส่งกลับ |
| 81 - 107 | **ดึงรายการสินค้า (`GET /products`)** | ค้นหาชื่อ/รายละเอียด และกรองตามหมวดหมู่ |
| 122 - 144 | **ดึงข้อมูลสินค้า 1 ชิ้น (`GET /products/:id`)** | ดึงข้อมูลสินค้าตามรหัส ID |
| 147 - 179 | **เพิ่มสินค้าใหม่ (`POST /products`)** | รับข้อมูลจากหน้าบ้านแล้วบันทึกลง Database |
| 182 - 222 | **แก้ไขสินค้า (`PUT /products/:id`)** | อัปเดตข้อมูลสินค้าที่มีอยู่เดิม |
| 225 - 245 | **ลบสินค้า (`DELETE /products/:id`)** | ลบสินค้าออกจาก Database ตามรหัส ID |

---

## 3. กรณีศึกษา: ถ้าเพิ่งเพิ่มฟิลด์ใหม่ใน Database ต้องมาแก้ Backend อย่างไร?

สมมติว่าคุณได้เพิ่มฟิลด์ **`brand` (ยี่ห้อ)** ใน `schema.prisma` แล้ว
ตอนนี้เราต้องบอกให้ Backend รู้จักฟิลด์ `brand` นี้ เพื่อให้รับข้อมูลและบันทึกได้ โดยแก้ 3 จุดใน `backend/index.js`:

### จุดที่ 1: การเพิ่มสินค้าใหม่ (`POST /products`)
มองหาบรรทัดที่เขียนว่า `app.post('/products', ...)`

```diff
 app.post('/products', async (req, res) => {
-  const { name, description, price, category, stock, imageUrl } = req.body;
+  const { name, description, price, category, stock, imageUrl, brand } = req.body;

   // ... ส่วนตรวจสอบความถูกต้อง ...

   try {
     const newProduct = await prisma.product.create({
       data: {
         name: name.trim(),
         description: description ? description.trim() : null,
         price: numPrice,
         category: category && category.trim() ? category.trim() : 'ทั่วไป',
         stock: isNaN(numStock) ? 0 : numStock,
         imageUrl: imageUrl ? imageUrl.trim() : null,
+        brand: brand ? brand.trim() : null, // <-- เพิ่มบรรทัดนี้เพื่อบันทึกยี่ห้อ
       }
     });
```

### จุดที่ 2: การแก้ไขสินค้า (`PUT /products/:id`)
มองหาบรรทัดที่เขียนว่า `app.put('/products/:id', ...)`

```diff
 app.put('/products/:id', async (req, res) => {
   // ...
-  const { name, description, price, category, stock, imageUrl } = req.body;
+  const { name, description, price, category, stock, imageUrl, brand } = req.body;

   try {
     const updateData = {};
     if (name !== undefined) updateData.name = name.trim();
     // ...
     if (imageUrl !== undefined) updateData.imageUrl = imageUrl ? imageUrl.trim() : null;
+    if (brand !== undefined) updateData.brand = brand ? brand.trim() : null; // <-- เพิ่มบรรทัดนี้
```

### จุดที่ 3: ให้ค้นหาตามฟิลด์ใหม่ได้ด้วย (`GET /products`)
ถ้าอยากให้พิมพ์ค้นหาชื่อยี่ห้อในช่อง Search ได้ ให้มองหา `app.get('/products', ...)`

```diff
   if (search) {
     where.OR = [
       { name: { contains: String(search) } },
       { description: { contains: String(search) } },
+      { brand: { contains: String(search) } }, // <-- ค้นหาจากชื่อยี่ห้อได้ด้วย
     ];
   }
```

---

## 4. อยากเปลี่ยนข้อความแจ้งเตือน (Error Message)

สามารถเปิด `backend/index.js` แล้วค้นหาคำภาษาไทยที่ต้องการเปลี่ยนได้ทันที เช่น:
- คำว่า `'กรุณากรอกชื่อสินค้าและราคา'` -> เปลี่ยนเป็น `'โปรดระบุชื่อและราคาสินค้าก่อนบันทึก'`
- คำว่า `'ราคาต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0'` -> เปลี่ยนตามต้องการได้เลย

---

## 5. การตั้งค่าการอัปโหลดรูปภาพ

มองหาบรรทัดที่ 40-45 ใน `backend/index.js`:

```javascript
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB (อยากเปลี่ยนขนาด ให้แก้เลข 5 ข้างหน้า)
  fileFilter: (req, file, cb) => {
    // นามสกุลไฟล์ที่อนุญาต
    const allowed = /jpeg|jpg|png|webp|gif/;
    // ...
  }
});
```

---

## 6. วิธีรันและรีสตาร์ท Backend
- ถ้ารันด้วยคำสั่ง:
  ```bash
  npm run dev
  ```
  ระบบจะใช้ `--watch` เมื่อคุณกด Save ไฟล์ ระบบจะรีสตาร์ทตัวเองอัตโนมัติทันที ไม่ต้องกดปิดเปิดใหม่ครับ!
