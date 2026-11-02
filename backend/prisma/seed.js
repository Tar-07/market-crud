const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial products...');
  
  // ลบข้อมูลเก่าก่อนเพื่อป้องกันข้อมูลซ้ำซ้อนเวลา seed ซ้ำ
  await prisma.product.deleteMany({});

  const sampleProducts = [
    {
      name: 'หูฟังไร้สาย Bluetooth Pro',
      description: 'หูฟังตัดเสียงรบกวน ANC แบตเตอรี่อึด ใช้งานได้ยาวนาน 30 ชั่วโมง เสียงคมชัด เบสแน่น',
      price: 1890,
      category: 'อิเล็กทรอนิกส์',
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'คีย์บอร์ดไร้สาย Mechanical Keyboard',
      description: 'คีย์บอร์ดกลไกสวิตช์ Red สัมผัสนุ่ม เงียบ รองรับไฟ RGB แสงสวยงาม เชื่อมต่อได้ 3 โหมด',
      price: 2490,
      category: 'อุปกรณ์คอมพิวเตอร์',
      stock: 12,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'เมาส์เกมมิ่ง Ergonomic Wireless',
      description: 'เมาส์ไร้สายเพื่อสุขภาพ ออกแบบตามสรีรศาสตร์ ลดอาการเมื่อยข้อมือ เซนเซอร์แม่นยำสูง',
      price: 990,
      category: 'อุปกรณ์คอมพิวเตอร์',
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'แก้วน้ำเก็บอุณหภูมิ สแตนเลส 304',
      description: 'เก็บความเย็นและความร้อนได้ยาวนาน 12-24 ชั่วโมง ผลิตจากวัสดุ Food Grade ปลอดภัย',
      price: 390,
      category: 'ของใช้ในบ้าน',
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'กระเป๋าเป้สะพายหลัง กันน้ำสไตล์มินิมอล',
      description: 'กระเป๋าเป้ใส่โน้ตบุ๊กขนาด 15.6 นิ้ว ผ้ากันละอองน้ำ มีช่องใส่ของหลายช่อง น้ำหนักเบา',
      price: 850,
      category: 'แฟชั่น',
      stock: 18,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'
    }
  ];

  for (const item of sampleProducts) {
    await prisma.product.create({
      data: item
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
