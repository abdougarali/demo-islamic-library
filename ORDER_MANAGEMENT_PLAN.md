# خطة التحويل إلى Order Management MVP

## نظرة عامة

### النظام الحالي:
- صفحة عرض كتب بسيطة
- زر واتساب لكل كتاب
- لا توجد قاعدة بيانات
- لا يوجد تتبع للطلبات

### النظام الجديد:
- نموذج طلب شامل
- حفظ الطلبات في قاعدة بيانات
- Dashboard للبائع لإدارة الطلبات
- تتبع حالة الطلبات (جديد / مؤكد / تم التسليم)

---

## التقنيات المستخدمة

### Frontend (موجود بالفعل):
- ✅ Next.js 16.1.1
- ✅ React 19.2.3
- ✅ TypeScript
- ✅ Tailwind CSS 4

### Backend (سيتم إضافتها):
- ➕ MongoDB Atlas (قاعدة البيانات)
- ➕ Mongoose (ODM)
- ➕ Simple Password Authentication (كلمة مرور بسيطة)
- ✅ Next.js API Routes (موجود)

### Real-time:
- ➕ Polling (تحديث كل 5 ثواني)

### تخزين الصور:
- ✅ Vercel Public Folder (موجود)

---

## الهيكل الجديد

```
app/
├── page.tsx                          → الصفحة الرئيسية (نموذج الطلب)
│
├── admin/
│   ├── login/
│   │   └── page.tsx                  → صفحة تسجيل دخول البائع
│   │
│   └── dashboard/
│       ├── page.tsx                  → لوحة تحكم البائع
│       └── orders/
│           └── [id]/
│               └── page.tsx          → تفاصيل طلب محدد
│
├── api/
│   ├── orders/
│   │   ├── route.ts                  → POST: إنشاء طلب جديد
│   │   └── [id]/
│   │       └── route.ts              → PATCH: تحديث حالة الطلب
│   │
│   └── admin/
│       ├── login/
│       │   └── route.ts              → POST: تسجيل دخول
│       │
│       ├── login/
│       │   └── route.ts              → POST: تسجيل دخول
│       ├── logout/
│       │   └── route.ts              → POST: تسجيل خروج
│       └── orders/
│           └── route.ts              → GET: جلب جميع الطلبات
│
├── components/
│   ├── OrderForm.tsx                 → نموذج الطلب (جديد)
│   ├── OrderCard.tsx                 → بطاقة عرض الطلب (جديد)
│   ├── OrderStatus.tsx               → عرض حالة الطلب (جديد)
│   └── FacebookPixel.tsx             → موجود
│
├── lib/
│   └── mongodb.ts                    → الاتصال بـ MongoDB (جديد)
│
└── models/
    └── Order.ts                      → Order Model (جديد)
```

---

## Database Schema (MongoDB)

### Collection: orders

```javascript
{
  _id: ObjectId,                      // تلقائي من MongoDB
  
  // معلومات العميل
  customerName: String,                // "أحمد محمد"
  customerPhone: String,               // "+216501234567"
  customerAddress: String,             // "تونس، شارع الحبيب بورقيبة"
  
  // الكتب المطلوبة
  books: [
    {
      id: String,                      // "1"
      title: String,                   // "قصة نضال"
      author: String,                  // "محمد العربي القروي"
      price: Number,                   // 45900 (بالمليم)
      image: String                    // "/images/book_img(1).jpg"
    }
  ],
  
  // معلومات الطلب
  totalPrice: Number,                  // 111400 (بالمليم)
  status: String,                      // "new" | "confirmed" | "delivered"
  notes: String,                       // "أريد التوصيل في الصباح"
  
  // معلومات تلقائية
  createdAt: Date,                     // تاريخ إنشاء الطلب
  updatedAt: Date                      // تاريخ آخر تحديث
}
```

---

## API Routes

### 1. إنشاء طلب جديد
```
POST /api/orders

Body:
{
  customerName: "أحمد محمد",
  customerPhone: "+216501234567",
  customerAddress: "تونس، شارع...",
  books: [...],
  totalPrice: 111400,
  notes: "..."
}

Response:
{
  success: true,
  orderId: "507f1f77bcf86cd799439011",
  message: "تم إرسال طلبك بنجاح"
}
```

### 2. جلب جميع الطلبات (Admin)
```
GET /api/admin/orders

Query Parameters:
?status=new           // فلترة حسب الحالة
?limit=50            // عدد النتائج
?page=1              // رقم الصفحة

Response:
{
  orders: [...],
  total: 42,
  page: 1,
  totalPages: 1
}
```

### 3. تحديث حالة الطلب (Admin)
```
PATCH /api/orders/[id]

Body:
{
  status: "confirmed"
}

Response:
{
  success: true,
  order: {...}
}
```

### 4. تسجيل دخول Admin
```
POST /api/admin/login

Body:
{
  password: "********"
}

Response:
{
  success: true
}
```

---

## خطة التنفيذ (Step by Step)

### المرحلة 1: إعداد البيئة (1 ساعة)

#### الخطوة 1.1: إعداد MongoDB Atlas
1. إنشاء حساب على MongoDB Atlas
2. إنشاء Cluster مجاني (M0)
3. إنشاء Database User
4. الحصول على Connection String
5. إضافة IP Address إلى Whitelist

#### الخطوة 1.2: تثبيت المكتبات
```bash
npm install mongoose
```

#### الخطوة 1.3: إعداد Environment Variables
```env
# .env.local
MONGODB_URI=mongodb+srv://...
ADMIN_PASSWORD=your-secret-password-123
```

---

### المرحلة 2: إنشاء Database Connection (30 دقيقة)

#### الخطوة 2.1: إنشاء `lib/mongodb.ts`
```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
```

#### الخطوة 2.2: إنشاء `models/Order.ts`
```typescript
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  books: [{
    id: String,
    title: String,
    author: String,
    price: Number,
    image: String
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'confirmed', 'delivered'],
    default: 'new'
  },
  notes: String
}, {
  timestamps: true
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
```

---

### المرحلة 3: إنشاء نموذج الطلب (2-3 ساعات)

#### الخطوة 3.1: إنشاء `components/OrderForm.tsx`
- نموذج يحتوي على:
  - حقل الاسم
  - حقل الهاتف
  - حقل العنوان
  - اختيار الكتب (checkboxes)
  - حقل الملاحظات (اختياري)
  - عرض المجموع تلقائياً
  - زر إرسال الطلب

#### الخطوة 3.2: تعديل `app/page.tsx`
- إضافة OrderForm بدلاً من أزرار واتساب
- أو: إبقاء خيار واتساب + إضافة خيار "طلب عبر الموقع"

---

### المرحلة 4: إنشاء API Routes (2 ساعة)

#### الخطوة 4.1: `app/api/orders/route.ts`
```typescript
import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const orderData = await request.json();
    
    // التحقق من البيانات
    if (!orderData.customerName || !orderData.customerPhone) {
      return Response.json(
        { error: 'البيانات غير مكتملة' },
        { status: 400 }
      );
    }
    
    // إنشاء الطلب
    const order = await Order.create({
      ...orderData,
      status: 'new'
    });
    
    return Response.json({
      success: true,
      orderId: order._id,
      message: 'تم إرسال طلبك بنجاح'
    });
    
  } catch (error) {
    return Response.json(
      { error: 'حدث خطأ أثناء إرسال الطلب' },
      { status: 500 }
    );
  }
}
```

#### الخطوة 4.2: `app/api/admin/orders/route.ts`
```typescript
import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // بناء الاستعلام
    const query: any = {};
    if (status) {
      query.status = status;
    }
    
    // جلب الطلبات
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
    
    return Response.json({
      orders,
      total: orders.length
    });
    
  } catch (error) {
    return Response.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    );
  }
}
```

#### الخطوة 4.3: `app/api/orders/[id]/route.ts`
```typescript
import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { status } = await request.json();
    
    const order = await Order.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );
    
    if (!order) {
      return Response.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      order
    });
    
  } catch (error) {
    return Response.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    );
  }
}
```

---

### المرحلة 5: إنشاء Authentication (30 دقيقة)

#### الخطوة 5.1: إنشاء API Route لتسجيل الدخول
```typescript
// app/api/admin/login/route.ts
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (password === process.env.ADMIN_PASSWORD) {
      // إنشاء session بسيط (cookie)
      cookies().set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 أيام
      });
      
      return Response.json({ success: true });
    }
    
    return Response.json(
      { error: 'كلمة المرور غير صحيحة' },
      { status: 401 }
    );
    
  } catch (error) {
    return Response.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    );
  }
}
```

#### الخطوة 5.2: إنشاء صفحة تسجيل الدخول
```typescript
// app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (res.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'كلمة المرور غير صحيحة');
      }
    } catch (error) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          تسجيل دخول البائع
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

#### الخطوة 5.3: إنشاء Middleware لحماية Dashboard
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  
  // إذا كان في Admin route لكن ليس في login page
  if (isAdminRoute && !isLoginPage) {
    // إذا لم يكن مسجل دخول → توجيه إلى login
    if (!session || session.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // إذا كان في login page ومسجل دخول → توجيه إلى dashboard
  if (isLoginPage && session?.value === 'authenticated') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
};
```

#### الخطوة 5.4: إنشاء API Route لتسجيل الخروج
```typescript
// app/api/admin/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  cookies().delete('admin_session');
  return NextResponse.json({ success: true });
}
```

---

### المرحلة 6: إنشاء Admin Dashboard (3-4 ساعات)

#### الخطوة 6.1: إنشاء `app/admin/dashboard/page.tsx`
- حماية الصفحة بـ Middleware (تلقائي)
- جلب الطلبات من API
- عرض الطلبات في جدول أو كروت
- فلترة حسب الحالة
- Polling كل 5 ثواني
- زر تسجيل خروج

#### الخطوة 6.2: إنشاء `components/OrderCard.tsx`
- عرض معلومات الطلب
- أزرار لتغيير الحالة
- عرض الكتب المطلوبة

#### الخطوة 6.3: إنشاء `components/OrderStatus.tsx`
- Badge لعرض الحالة
- ألوان مختلفة لكل حالة

---

### المرحلة 7: الاختبار والتحسينات (2 ساعة)

#### الخطوة 7.1: اختبار تدفق العمل الكامل
1. العميل يملأ نموذج الطلب
2. يرسل الطلب
3. البائع يرى الطلب في Dashboard
4. البائع يغير الحالة

#### الخطوة 7.2: إضافة Loading States
- Spinners أثناء التحميل
- Skeleton loaders

#### الخطوة 7.3: إضافة Error Handling
- رسائل خطأ واضحة
- Toast notifications

---

## التقدير الزمني الإجمالي

| المرحلة | الوقت |
|---------|-------|
| إعداد البيئة | 1 ساعة |
| Database Connection | 30 دقيقة |
| نموذج الطلب | 2-3 ساعات |
| API Routes | 2 ساعة |
| Authentication | 30 دقيقة |
| Admin Dashboard | 3-4 ساعات |
| الاختبار والتحسينات | 2 ساعة |
| **المجموع** | **10-13 ساعة** |

**يمكن إنجازه في: 2-3 أيام عمل**

---

## التكلفة

### مجاني تماماً:
- ✅ MongoDB Atlas Free Tier (512MB)
- ✅ Vercel Hosting (100GB bandwidth)
- ✅ Next.js API Routes
- ✅ Simple Password Auth (بدون مكتبات)
- ✅ Vercel Public Folder (للصور)

**المجموع: $0/شهر**

---

## الميزات الإضافية (اختيارية)

### يمكن إضافتها لاحقاً:

1. **إشعارات WhatsApp**
   - إرسال رسالة للبائع عند طلب جديد
   - إرسال رسالة للعميل عند تغيير الحالة

2. **تقارير وإحصائيات**
   - عدد الطلبات اليومية
   - إجمالي المبيعات
   - الكتب الأكثر طلباً

3. **بحث وفلترة متقدمة**
   - بحث بالاسم أو رقم الهاتف
   - فلترة بالتاريخ
   - تصدير البيانات (Excel/PDF)

4. **تحسينات UX**
   - Real-time بدلاً من Polling
   - Push notifications
   - نظام رسائل داخلي

---

## ملاحظات مهمة

### الأمان:
- ✅ التحقق من البيانات في API
- ✅ حماية Dashboard بـ Authentication
- ✅ Rate limiting (اختياري)
- ✅ استخدام HTTPS في الإنتاج

### الأداء:
- ✅ Caching للطلبات
- ✅ Pagination للطلبات الكثيرة
- ✅ تحسين استعلامات MongoDB

### تجربة المستخدم:
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Responsive design

---

## الخطوات التالية

1. ✅ قراءة هذه الخطة
2. ⬜ إنشاء حساب MongoDB Atlas
3. ⬜ تثبيت المكتبات
4. ⬜ البدء بالمرحلة 1

هل أنت جاهز للبدء؟
