# دليل الإعداد السريع

## الخطوة 1: إعداد MongoDB Atlas

### 1. إنشاء حساب:
1. اذهب إلى: https://www.mongodb.com/cloud/atlas
2. سجل حساب مجاني
3. اختر Free tier (M0)

### 2. إنشاء Cluster:
1. اضغط "Build a Database"
2. اختر "M0 FREE" (مجاني)
3. اختر Cloud Provider و Region
4. اضغط "Create"

### 3. إنشاء Database User:
1. اذهب إلى "Database Access"
2. اضغط "Add New Database User"
3. اختر "Password" authentication
4. أدخل username و password
5. اختر "Read and write to any database"
6. اضغط "Add User"

### 4. Whitelist IP Address:
1. اذهب إلى "Network Access"
2. اضغط "Add IP Address"
3. اضغط "Allow Access from Anywhere" (للتطوير)
   - أو أضف IP محدد للإنتاج
4. اضغط "Confirm"

### 5. الحصول على Connection String:
1. اذهب إلى "Database"
2. اضغط "Connect" على Cluster
3. اختر "Connect your application"
4. انسخ Connection String
   - مثال: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`
5. استبدل `<password>` بكلمة المرور
6. أضف اسم Database في نهاية الـ URL:
   - مثال: `mongodb+srv://username:password@cluster.mongodb.net/library-orders?retryWrites=true&w=majority`

---

## الخطوة 2: إعداد Environment Variables

### إنشاء ملف `.env.local`:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library-orders?retryWrites=true&w=majority

# Admin Password (كلمة مرور Dashboard)
ADMIN_PASSWORD=your-secret-password-123

# Next.js
NODE_ENV=development
```

**ملاحظات مهمة:**
- ✅ لا ترفع `.env.local` إلى GitHub (موجود في .gitignore)
- ✅ استبدل `username` و `password` بقيمك
- ✅ اختر كلمة مرور قوية لـ `ADMIN_PASSWORD`
- ✅ استبدل `library-orders` باسم Database الذي تريده

---

## الخطوة 3: اختبار الاتصال

بعد إعداد MongoDB و `.env.local`:

1. شغل المشروع:
```bash
npm run dev
```

2. افتح: http://localhost:3003

3. يجب أن يعمل بدون أخطاء!

---

## الخطوات التالية

بعد إعداد MongoDB بنجاح:
- ✅ سيتم إنشاء API Routes
- ✅ سيتم إنشاء نموذج الطلب
- ✅ سيتم إنشاء Dashboard

---

## حل المشاكل الشائعة

### خطأ: "MONGODB_URI is not defined"
- تأكد من وجود ملف `.env.local`
- تأكد من وجود `MONGODB_URI` في الملف
- أعد تشغيل المشروع

### خطأ: "Authentication failed"
- تأكد من استبدال `<password>` في Connection String
- تأكد من username و password صحيحة

### خطأ: "IP not whitelisted"
- اذهب إلى Network Access في MongoDB Atlas
- أضف IP Address أو Allow Access from Anywhere

---

## مساعدة إضافية

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Mongoose Docs: https://mongoosejs.com/docs/
