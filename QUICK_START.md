# 🚀 خطوات سريعة للنشر على Vercel

## الخطوة 1: رفع المشروع إلى GitHub

### إذا لم يكن لديك مستودع GitHub:

1. **إنشاء مستودع جديد على GitHub**:
   - اذهب إلى: https://github.com/new
   - اختر اسم للمستودع (مثلاً: `demo-islamic-library`)
   - اختر Public أو Private
   - **لا** تضع README أو .gitignore (لأن المشروع يحتوي عليها)
   - اضغط "Create repository"

2. **رفع المشروع**:
   ```bash
   cd C:\Users\ASUS\Desktop\Library_projects\demo-islamic-library
   git init
   git add .
   git commit -m "Initial commit: Demo Islamic Library"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/demo-islamic-library.git
   git push -u origin main
   ```
   (استبدل `YOUR_USERNAME` باسم مستخدمك على GitHub)

---

## الخطوة 2: النشر على Vercel

### الطريقة السريعة:

1. **اذهب إلى Vercel**:
   - افتح: https://vercel.com/new
   - سجّل الدخول باستخدام GitHub (إذا لم تكن مسجل)

2. **Import Project**:
   - اضغط على "Add New..." → "Project"
   - اختر المستودع `demo-islamic-library` من قائمة GitHub repositories
   - اضغط "Import"

3. **إعدادات المشروع**:
   - **Framework Preset**: Next.js (سيتم اكتشافه تلقائياً)
   - **Root Directory**: `./` (اتركه افتراضي)
   - **Build Command**: `npm run build` (افتراضي)
   - **Output Directory**: `.next` (افتراضي)
   - **Install Command**: `npm install` (افتراضي)
   
   **لا تحتاج لتغيير أي شيء!** فقط اضغط "Deploy"

4. **انتظر حتى ينتهي Build**:
   - سترى سجل Build في الوقت الفعلي
   - عادة ما يستغرق 1-2 دقيقة

5. **احصل على رابط الموقع**:
   - بعد النشر الناجح، ستحصل على رابط مثل:
   - `https://demo-islamic-library-xyz.vercel.app`

---

## الخطوة 3: (اختياري) تخصيص النطاق

1. اذهب إلى Project Settings → Domains
2. أضف نطاق مخصص إذا أردت

---

## ✅ تأكد من:

- ✅ جميع الصور موجودة في `/public/images` (21 صورة)
- ✅ رقم WhatsApp في `app/page.tsx` هو الرقم الصحيح
- ✅ Build نجح بدون أخطاء

---

## 🔄 تحديثات مستقبلية:

كلما قمت بتحديث الكود ورفعته إلى GitHub:
```bash
git add .
git commit -m "Your update message"
git push
```

Vercel سينشر التحديثات تلقائياً! 🎉

---

## ❓ مساعدة:

- إذا واجهت مشاكل في Build: راجع Build Logs في Vercel Dashboard
- إذا لم تظهر الصور: تأكد من أن جميع الصور في `/public/images`
- للمساعدة: راجع `DEPLOYMENT.md` للمزيد من التفاصيل


