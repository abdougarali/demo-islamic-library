# 🔐 متغيرات البيئة المطلوبة (Environment Variables)

## 📋 المتغيرات المطلوبة للـ Commit والـ Deploy

### ✅ المتغيرات الإجبارية (Required):

#### 1. `MONGODB_URI`
- **الوصف**: Connection String لـ MongoDB Atlas
- **النوع**: String
- **مثال**: 
  ```
  mongodb+srv://username:password@cluster.mongodb.net/library-orders?retryWrites=true&w=majority
  ```
- **كيفية الحصول عليه**:
  1. اذهب إلى MongoDB Atlas: https://www.mongodb.com/cloud/atlas
  2. اختر Cluster الخاص بك
  3. اضغط "Connect" > "Connect your application"
  4. انسخ Connection String
  5. استبدل `<password>` بكلمة المرور
  6. أضف اسم Database في نهاية URL (مثلاً: `library-orders`)
- **استخدام**: للاتصال بقاعدة البيانات

#### 2. `ADMIN_PASSWORD`
- **الوصف**: كلمة مرور تسجيل دخول Dashboard للبائع
- **النوع**: String
- **مثال**: `Books-admin123` أو أي كلمة مرور قوية
- **استخدام**: لتسجيل دخول البائع في `/admin/login`
- **⚠️ مهم**: اختر كلمة مرور قوية وفريدة!

---

### 🔹 المتغيرات الاختيارية (Optional):

#### 3. `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`
- **الوصف**: Facebook Pixel ID لتتبع الزوار والأحداث
- **النوع**: String
- **مثال**: `123456789012345`
- **كيفية الحصول عليه**:
  1. اذهب إلى: https://business.facebook.com/events_manager
  2. أنشئ Pixel جديد أو اختر Pixel موجود
  3. انسخ Pixel ID
- **استخدام**: لتتبع الزوار والأحداث (Purchase, AddToCart, etc.)
- **ملاحظة**: إذا لم تضيفه، سيتم تجاهله بدون أخطاء

#### 4. `NODE_ENV`
- **الوصف**: بيئة التشغيل
- **النوع**: String
- **القيم**: `development` أو `production`
- **القيمة الافتراضية**: يتم تعيينه تلقائياً في Vercel
- **استخدام**: لتحديد بيئة التشغيل (development/production)

---

## 📝 ملف `.env.local` (للـ Development):

أنشئ ملف `.env.local` في جذر المشروع:

```env
# MongoDB Atlas Connection String (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library-orders?retryWrites=true&w=majority

# Admin Password for Dashboard (Required)
ADMIN_PASSWORD=your-secure-password-here

# Facebook Pixel ID (Optional)
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=123456789012345

# Node Environment (Optional - Next.js sets it automatically)
NODE_ENV=development
```

### ✅ تأكد من:
- ✅ الملف موجود في `.gitignore` (لا يتم رفعه إلى GitHub)
- ✅ استبدل `username` و `password` بقيمك الحقيقية
- ✅ استبدل `library-orders` باسم Database الذي تريده
- ✅ اختر كلمة مرور قوية لـ `ADMIN_PASSWORD`

---

## 🚀 إعداد Environment Variables في Vercel (للـ Production):

### الطريقة 1: من Vercel Dashboard (الأسهل)

1. **اذهب إلى Vercel Dashboard**:
   - https://vercel.com
   - اختر مشروعك

2. **اذهب إلى Settings**:
   - اضغط على المشروع
   - اضغط على "Settings" من القائمة العلوية
   - اختر "Environment Variables" من القائمة الجانبية

3. **أضف المتغيرات**:
   - اضغط "Add New"
   - أدخل:
     - **Key**: `MONGODB_URI`
     - **Value**: `mongodb+srv://username:password@cluster.mongodb.net/library-orders?retryWrites=true&w=majority`
     - **Environment**: اختر `Production`, `Preview`, `Development` (أو كلهم)
   - اضغط "Save"
   
   - كرر الخطوة لكل متغير:
     - `ADMIN_PASSWORD`
     - `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` (إذا كنت تستخدمه)

4. **Redeploy**:
   - بعد إضافة المتغيرات، اذهب إلى "Deployments"
   - اضغط على "..." بجانب آخر deployment
   - اختر "Redeploy"
   - تأكد من "Use existing Build Cache" غير مفعل (للتأكد من استخدام المتغيرات الجديدة)

### الطريقة 2: من Vercel CLI

```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# إضافة متغيرات البيئة
vercel env add MONGODB_URI
# أدخل القيمة عندما يُطلب منك
# اختر البيئات (Production, Preview, Development)

vercel env add ADMIN_PASSWORD
# أدخل القيمة

vercel env add NEXT_PUBLIC_FACEBOOK_PIXEL_ID
# أدخل القيمة (اختياري)

# Redeploy
vercel --prod
```

---

## ✅ Checklist قبل الـ Deploy:

### قبل الـ Commit:
- [ ] تأكد من وجود `.env.local` في `.gitignore`
- [ ] تأكد من عدم وجود `.env.local` في Git
- [ ] اختبر المشروع محلياً (`npm run dev`)
- [ ] تأكد من أن Build يعمل (`npm run build`)

### قبل الـ Deploy:
- [ ] أضف جميع المتغيرات المطلوبة في Vercel
- [ ] تأكد من صحة `MONGODB_URI`
- [ ] تأكد من صحة `ADMIN_PASSWORD`
- [ ] اختبر الاتصال بقاعدة البيانات
- [ ] اختبر تسجيل الدخول في Dashboard

---

## 🔒 أمان المتغيرات:

### ✅ DO (افعل):
- ✅ استخدم كلمات مرور قوية
- ✅ لا تشارك `.env.local` مع أحد
- ✅ استخدم Environment Variables في Vercel (آمن)
- ✅ راجع `.gitignore` للتأكد من أن `.env*` موجود

### ❌ DON'T (لا تفعل):
- ❌ لا ترفع `.env.local` إلى GitHub
- ❌ لا تشارك `ADMIN_PASSWORD` مع أحد
- ❌ لا تضع `MONGODB_URI` في الكود مباشرة
- ❌ لا تستخدم نفس كلمة المرور في Development و Production

---

## 🐛 حل المشاكل الشائعة:

### خطأ: "MONGODB_URI is not defined"
**الحل**:
1. تأكد من وجود المتغير في Vercel Environment Variables
2. تأكد من أنه في `Production` environment
3. قم بـ Redeploy بعد إضافة المتغير

### خطأ: "ADMIN_PASSWORD is not defined"
**الحل**:
1. أضف `ADMIN_PASSWORD` في Vercel
2. Redeploy

### خطأ: "Authentication failed" في MongoDB
**الحل**:
1. تحقق من `MONGODB_URI` في Vercel
2. تأكد من استبدال `<password>` بكلمة المرور الحقيقية
3. تأكد من أن IP whitelisted في MongoDB Atlas (أو Allow from anywhere)

### خطأ: "Cannot login to Dashboard"
**الحل**:
1. تأكد من وجود `ADMIN_PASSWORD` في Vercel
2. تأكد من استخدام نفس القيمة في `.env.local` و Vercel
3. Redeploy بعد تغيير `ADMIN_PASSWORD`

---

## 📚 مصادر إضافية:

- **MongoDB Atlas Setup**: راجع `SETUP_GUIDE.md`
- **Deployment Guide**: راجع `DEPLOYMENT.md`
- **Vercel Docs**: https://vercel.com/docs/concepts/projects/environment-variables

---

## ✨ ملخص سريع:

```bash
# 1. أنشئ .env.local محلياً
MONGODB_URI=mongodb+srv://...
ADMIN_PASSWORD=your-password

# 2. أضف نفس المتغيرات في Vercel Dashboard
# Settings > Environment Variables > Add New

# 3. Redeploy
vercel --prod
```

**جاهز للـ Deploy! 🚀**
