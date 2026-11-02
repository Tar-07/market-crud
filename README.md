# 🛒 Market CRUD System (ระบบจัดการสินค้า)

ระบบเว็บแอปพลิเคชันสำหรับจัดการสินค้า (Product Management) รองรับการ ทำงาน **CRUD** (เพิ่ม, ดู, แก้ไข, ลบ) เต็มรูปแบบ พร้อมฟังก์ชันค้นหา, ตัวกรองหมวดหมู่ และการอัปโหลดรูปภาพสินค้า

โปรเจกต์นี้ใช้ Stack เดียวกับ `book-review-api`:
- **Frontend**: Next.js 16 (React 19, TypeScript, Tailwind CSS v4, Lucide Icons)
- **Backend**: Express.js (Node.js) + Multer (File Uploads) + CORS
- **Database / ORM**: SQLite + Prisma ORM 5.x

---

## 📋 ขั้นตอนการติดตั้งและรันหลังโคลนโปรเจกต์ (After Git Clone)

เมื่อคุณทำการโคลนโปรเจกต์มาจาก Git ให้ทำตามขั้นตอนทีละสเต็ปด้านล่างนี้ได้เลยครับ:

### สเต็ปที่ 1: เข้าสู่โฟลเดอร์โปรเจกต์
```bash
cd market
```

---

### สเต็ปที่ 2: ติดตั้งและเปิดเซิร์ฟเวอร์ Backend (Terminal 1)

เปิด **Terminal ที่ 1** แล้วรันคำสั่งตามลำดับดังนี้:

```bash
# 1. เข้าสู่โฟลเดอร์ backend
cd backend

# 2. คัดลอกไฟล์ตั้งค่า .env (กรณีที่ไม่มีไฟล์ .env หลังโคลน)
# สำหรับ Windows (PowerShell):
copy .env.example .env
# หรือถ้าใช้ Command Prompt / Git Bash / Mac / Linux:
cp .env.example .env

# 3. ติดตั้ง Dependencies และแพ็กเกจต่างๆ
npm install

# 4. สร้างฐานข้อมูล SQLite (dev.db) ให้ตรงกับโครงสร้าง Prisma
npx prisma db push

# 5. ใส่ข้อมูลสินค้าตัวอย่างเริ่มต้น 5 รายการ
node prisma/seed.js

# 6. เริ่มต้นรันเซิร์ฟเวอร์ Backend
npm run dev
```

> ✅ **ผลลัพธ์**: Backend จะเปิดทำงานอยู่ที่ **http://localhost:5000**  
> *(เปิดหน้าต่างนี้ทิ้งไว้ ห้ามปิด)*

---

### สเต็ปที่ 3: ติดตั้งและเปิดเว็บแอปพลิเคชัน Frontend (Terminal 2)

เปิด **Terminal ที่ 2** (หน้าต่างใหม่) แล้วรันคำสั่งตามลำดับดังนี้:

```bash
# 1. เข้าสู่โฟลเดอร์ frontend
cd market/frontend
# (หรือถ้าเปิดจากไดเรกทอรีหลัก ให้พิมพ์: cd frontend)

# 2. คัดลอกไฟล์ตั้งค่า .env.local
# สำหรับ Windows (PowerShell):
copy .env.example .env.local
# หรือถ้าใช้ Command Prompt / Git Bash / Mac / Linux:
cp .env.example .env.local

# 3. ติดตั้ง Dependencies ฝั่งหน้าเว็บ
npm install

# 4. เริ่มต้นรันเว็บแอปพลิเคชัน Frontend
npm run dev
```

> ✅ **ผลลัพธ์**: หน้าเว็บจะเปิดทำงานอยู่ที่ **http://localhost:3001**  
> สามารถเปิดเบราว์เซอร์เข้าที่ URL นี้เพื่อเริ่มใช้งานได้ทันที!

---

## 🌐 ตารางสรุปพอร์ตและ URL การใช้งาน

| ส่วนงาน | URL ที่เปิดใช้งาน | หน้าที่ |
|---|---|---|
| 🖥️ **Frontend** | [http://localhost:3001](http://localhost:3001) | หน้าเว็บหลักสำหรับ เพิ่ม/ลบ/แก้ไข/ค้นหาสินค้า |
| ⚙️ **Backend API** | [http://localhost:5000](http://localhost:5000) | เซิร์ฟเวอร์ API สำหรับรับ-ส่งข้อมูล |
| 🗄️ **Prisma Studio** | [http://localhost:5555](http://localhost:5555) | หน้าจอจัดการฐานข้อมูลเหมือน Excel (รันด้วย `npx prisma studio` ใน backend) |

---

## 📚 คู่มือการปรับแต่งสำหรับผู้เริ่มต้น (เขียนโค้ดไม่เป็นก็แก้ได้)

เราได้แยกคู่มือการปรับแต่งอย่างละเอียดไว้เป็น 3 ไฟล์ตามส่วนการทำงาน:

| ส่วนงาน | ลิงก์คู่มือ | เนื้อหาข้างใน |
|---|---|---|
| 🗄️ **Database (ฐานข้อมูล)** | [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) | วิธีดูข้อมูลเหมือน Excel ผ่านเว็บ (`npx prisma studio`), วิธีเพิ่มคอลัมน์ใหม่, การเปลี่ยนข้อมูลเริ่มต้น |
| ⚙️ **Backend (เซิร์ฟเวอร์ & API)** | [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) | วิธีรับข้อมูลฟิลด์ใหม่, การเปลี่ยน Port, การตั้งค่าการอัปโหลดรูป, การเปลี่ยนข้อความ Error |
| 🖥️ **Frontend (หน้าเว็บ & การแสดงผล)** | [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md) | วิธีเปลี่ยนชื่อเว็บ, การเปลี่ยนธีมสี, การเพิ่มช่องกรอกในฟอร์ม, การแสดงผลในการ์ดสินค้า |

---

## 🔄 แผนภาพการเชื่อมโยง: "ถ้าอยากเพิ่มข้อมูลใหม่ 1 อย่าง ต้องแก้ที่ไหนบ้าง?"

```
1. DATABASE (schema.prisma)   --> เพิ่มชื่อฟิลด์ในตาราง แล้วรัน `npx prisma db push`
       ↓
2. BACKEND (index.js)         --> เพิ่มให้ API รับค่าและบันทึกลงฐานข้อมูล
       ↓
3. FRONTEND (page.tsx)        --> เพิ่มช่องกรอกในฟอร์ม และเพิ่มข้อความแสดงผลในการ์ดสินค้า
```

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```
market/
├── backend/
│   ├── index.js               # Express Server & RESTful API endpoints
│   ├── prisma/
│   │   ├── schema.prisma      # โมเดลข้อมูล Product (SQLite)
│   │   ├── dev.db             # ไฟล์ฐานข้อมูล SQLite (สร้างอัตโนมัติหลังรัน db push)
│   │   └── seed.js            # ข้อมูลตัวอย่างสินค้าเริ่มต้น
│   ├── uploads/               # โฟลเดอร์จัดเก็บรูปภาพสินค้าที่อัปโหลด
│   ├── .env.example           # ไฟล์ตัวอย่างการตั้งค่าพอร์ตและ DATABASE_URL
│   ├── .env                   # ไฟล์ตั้งค่าสภาพแวดล้อมจริง
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx         # โครงร่างหน้าเว็บ
│   │   ├── globals.css        # สไตล์ Tailwind CSS
│   │   └── page.tsx           # หน้าจอ CRUD (ค้นหา, เพิ่ม, แก้ไข, ลบ, อัปโหลด)
│   ├── .env.example           # ตัวอย่าง URL ชี้ไปยัง backend
│   ├── .env.local             # ไฟล์ตั้งค่า URL เชื่อมต่อ API
│   ├── package.json
│   └── next.config.ts
│
├── DATABASE_GUIDE.md          # 🗄️ คู่มือการปรับแต่งฐานข้อมูล
├── BACKEND_GUIDE.md           # ⚙️ คู่มือการปรับแต่ง Backend
├── FRONTEND_GUIDE.md          # 🖥️ คู่มือการปรับแต่ง Frontend
└── README.md
```

---

## ❓ คำถามที่พบบ่อยหลังโคลน (Troubleshooting)

1. **เปิดหน้าเว็บแล้วขึ้นว่า `ไม่สามารถเชื่อมต่อ Backend ได้`**
   - ตรวจสอบว่าได้เปิด Terminal รัน Backend ที่โฟลเดอร์ `backend` ด้วยคำสั่ง `npm run dev` แล้วหรือยัง
   - ตรวจสอบไฟล์ `frontend/.env.local` ว่ามีข้อความ `NEXT_PUBLIC_API_URL=http://localhost:5000` อยู่หรือไม่

2. **หน้าเว็บไม่มีสินค้าแสดงขึ้นมาเลย**
   - เข้าโฟลเดอร์ `backend` แล้วรัน `npx prisma db push` ตามด้วย `node prisma/seed.js` เพื่อใส่ข้อมูลตัวอย่างสินค้า 5 รายการแรกครับ

3. **พอร์ตชนกับโปรแกรมอื่น (Port in use)**
   - ถ้าพอร์ต `5000` ชน: แก้ไขเลขพอร์ตใน `backend/.env` และไปแก้ใน `frontend/.env.local` ให้ตรงกัน
   - ถ้าพอร์ต `3001` ชน: แก้ไขเลขพอร์ตใน `frontend/package.json` ตรงส่วน `"dev": "next dev -p <เลขพอร์ตใหม่>"`
