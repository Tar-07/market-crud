# 🖥️ คู่มือการปรับแต่ง Frontend (Frontend Guide)
> สำหรับผู้เริ่มต้น / ไม่เคยเขียน React, Next.js หรือ Tailwind CSS มาก่อน

Frontend เปรียบเสมือน **"หน้าร้าน"** ที่ลูกค้าหรือผู้ใช้งานมองเห็นและคลิกใช้งาน (ปุ่มกด, แบบฟอร์ม, การ์ดแสดงสินค้า)

---

## 📍 สารบัญไฟล์ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
|---|---|
| `frontend/app/page.tsx` | **ไฟล์หลักของหน้าเว็บ** ทั้งตารางสินค้า, ปุ่มกด, แบบฟอร์มเพิ่ม/แก้ไข (90% ของการแก้ไขจะอยู่ที่นี่) |
| `frontend/app/layout.tsx` | กำหนดหัวเรื่องเว็บ (Title bar), คำอธิบายเว็บ (Meta Description) |
| `frontend/app/globals.css` | กำหนดสีพื้นหลังหลัก และสไตล์รวม |
| `frontend/.env.local` | ชี้ URL ไปยัง Backend (เช่น `NEXT_PUBLIC_API_URL=http://localhost:5000`) |
| `frontend/package.json` | กำหนดหมายเลขพอร์ตที่รันเว็บ (ปัจจุบันพอร์ต `3001`) |

---

## 1. วิธีเปลี่ยนชื่อเว็บ, หัวข้อ และคำอธิบาย

### เปลี่ยนชื่อบนแท็บเบราว์เซอร์
เปิดไฟล์ `frontend/app/layout.tsx` แล้วมองหา:
```typescript
export const metadata: Metadata = {
  title: "ระบบจัดการสินค้า - Market CRUD", // <-- แก้ชื่อแท็บเบราว์เซอร์ตรงนี้
  description: "ระบบเพิ่ม ลบ แก้ไข และจัดการสินค้าในร้านค้า (Market)",
};
```

### เปลี่ยนหัวข้อใหญ่บนหน้าเว็บ
เปิดไฟล์ `frontend/app/page.tsx` แล้วค้นหาคำว่า `Market System`:
```tsx
<h1 className="text-2xl font-bold text-slate-900 tracking-tight">Market System</h1>
<p className="text-xs text-slate-500 font-medium">ระบบบริหารจัดการและจัดเก็บข้อมูลสินค้า (CRUD)</p>
```
แก้ข้อความในแท็ก `<h1>` และ `<p>` เป็นชื่อร้านของคุณได้เลย เช่น `ร้านค้าเจริญพาณิชย์`

---

## 2. วิธีเปลี่ยนธีมสีของหน้าเว็บ (Tailwind CSS)

ในโค้ดปัจจุบันใช้โทนสี **Indigo (ม่วงน้ำเงิน)** เช่น `bg-indigo-600`, `text-indigo-600`
ถ้าคุณอยากเปลี่ยนเป็นสีอื่น สามารถใช้ฟังก์ชัน **Find and Replace (Ctrl + H)** ในโปรแกรมเขียนโค้ด (เช่น VS Code / Cursor / Windsurf) เปลี่ยนคำว่า `indigo` เป็นชื่อสีอื่นได้เลยทั้งไฟล์:

| ชื่อสี | ตัวอย่างโค้ด | อารมณ์ความรู้สึก |
|---|---|---|
| 🟢 **Emerald (เขียวสดใส)** | `emerald-600` | ร้านสุขภาพ, การเกษตร, สดชื่น |
| 🔵 **Blue (น้ำเงินมาตรฐาน)** | `blue-600` | ความน่าเชื่อถือ, ไอที, โมเดิร์น |
| 🟠 **Amber / Orange (ส้มทอง)** | `amber-500` / `orange-600` | ร้านอาหาร, คาเฟ่, ขนม |
| 🟣 **Purple / Violet (ม่วง)** | `purple-600` | แฟชั่น, หรูหรา, ความงาม |
| ⚫ **Rose (แดงชมพู)** | `rose-600` | ของขวัญ, เครื่องสำอาง, ดอกไม้ |

---

## 3. กรณีศึกษา: อยากเพิ่มช่องกรอกข้อมูลใหม่ในฟอร์ม (เช่น "ยี่ห้อสินค้า / Brand")

หลังจากที่เพิ่มฟิลด์ใน Database และ Backend แล้ว ถ้าอยากให้มีช่องกรอกในหน้าเว็บ ให้แก้ที่ `frontend/app/page.tsx` ตาม 4 ขั้นตอนนี้:

### ขั้นตอนที่ 1: เพิ่มชนิดข้อมูลใน TypeScript Interface
มองหา `interface Product` ด้านบนสุดของไฟล์ (ประมาณบรรทัด 20):
```diff
 interface Product {
   id: number;
   name: string;
   description: string | null;
   price: number;
   category: string;
   stock: number;
   imageUrl: string | null;
+  brand?: string | null; // <-- เพิ่มบรรทัดนี้
   createdAt: string;
   updatedAt: string;
 }
```

### ขั้นตอนที่ 2: เพิ่มลงในตัวเก็บข้อมูลของฟอร์ม (`formData`)
มองหา `useState` ของ formData (ประมาณบรรทัด 45):
```diff
   const [formData, setFormData] = useState({
     name: '',
     description: '',
     price: '',
     category: 'ทั่วไป',
     stock: '',
     imageUrl: '',
+    brand: '', // <-- เพิ่มบรรทัดนี้
   });
```
และในฟังก์ชัน `handleOpenCreateModal` กับ `handleOpenEditModal`:
```diff
   // ใน handleOpenCreateModal:
   setFormData({
     // ...
+    brand: '',
   });

   // ใน handleOpenEditModal:
   setFormData({
     // ...
+    brand: product.brand || '',
   });
```

### ขั้นตอนที่ 3: ส่งข้อมูลไปยัง Backend
มองหาฟังก์ชัน `handleSubmit`:
```diff
   const payload = {
     name: formData.name.trim(),
     description: formData.description.trim() || null,
     price: parseFloat(formData.price),
     category: formData.category.trim() || 'ทั่วไป',
     stock: parseInt(formData.stock) || 0,
     imageUrl: formData.imageUrl.trim() || null,
+    brand: formData.brand.trim() || null, // <-- เพิ่มส่งค่า brand ไปยัง API
   };
```

### ขั้นตอนที่ 4: ใส่ช่อง `<input>` ในหน้าต่าง Modal Popup
เลื่อนลงมาที่ส่วนของฟอร์มใน Modal (ค้นหาคำว่า `{/* Category & Price & Stock */}`):
คุณสามารถคัดลอกบล็อกของ `Category` มาวางแล้วเปลี่ยนเป็น `ยี่ห้อ` ได้เลย:

```tsx
<div>
  <label className="block text-xs font-semibold text-slate-700 mb-1">
    ยี่ห้อ (Brand)
  </label>
  <input
    type="text"
    placeholder="เช่น Apple, Sony, Nike"
    value={formData.brand}
    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
  />
</div>
```

---

## 4. อยากให้การ์ดสินค้าแสดงข้อมูลใหม่ที่เพิ่มเข้ามา

ในการ์ดสินค้าแต่ละใบ (ค้นหาคำว่า `{/* Product Details */}`):
คุณสามารถใส่ข้อความแสดงผลได้ตามต้องการ เช่น:

```tsx
{item.brand && (
  <span className="text-[11px] font-medium text-slate-500 mb-1 block">
    ยี่ห้อ: {item.brand}
  </span>
)}
```

---

## 5. วิธีเปลี่ยนพอร์ตของ Frontend

หากพอร์ต `3001` ชนกับโปรแกรมอื่น หรือต้องการเปลี่ยนเป็นพอร์ตอื่น:
1. เปิดไฟล์ `frontend/package.json`
2. แก้ไขในส่วน `scripts`:
   ```json
   "scripts": {
     "dev": "next dev -p 3005",
     "start": "next start -p 3005"
   }
   ```
3. รัน `npm run dev` หน้าเว็บจะไปเปิดที่พอร์ตใหม่ทันที
