# 📤 رفع المشروع إلى GitHub - خطوة بخطوة

## الخطوة 1: إنشاء مستودع جديد على GitHub

1. اذهب إلى: https://github.com/new
2. اختر اسم للمستودع: `demo-islamic-library` (أو أي اسم تفضله)
3. اختر **Public** أو **Private** (حسب ما تفضله)
4. **⚠️ مهم**: **لا** تضع علامة على:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
   
   (لأن المشروع يحتوي بالفعل على هذه الملفات)
5. اضغط **"Create repository"**

---

## الخطوة 2: رفع المشروع

بعد إنشاء المستودع، GitHub سيعرض لك أوامر. استخدم هذه الأوامر:

```bash
# 1. انتقل إلى مجلد المشروع
cd C:\Users\ASUS\Desktop\Library_projects\demo-islamic-library

# 2. أضف جميع الملفات
git add .

# 3. احفظ التغييرات
git commit -m "Complete demo Islamic library with 21 books and carousel"

# 4. أضف رابط GitHub (استبدل YOUR_USERNAME باسم مستخدمك)
git remote add origin https://github.com/YOUR_USERNAME/demo-islamic-library.git

# 5. رفع المشروع
git push -u origin main
```

**ملاحظة**: إذا كان المستودع على branch اسمه `master` بدلاً من `main`:
```bash
git branch -M main
git push -u origin main
```

أو إذا أردت استخدام `master`:
```bash
git push -u origin master
```

---

## الخطوة 3: التحقق

بعد رفع المشروع:
1. اذهب إلى صفحة المستودع على GitHub
2. تأكد من أن جميع الملفات موجودة:
   - ✅ `app/` folder
   - ✅ `data/` folder
   - ✅ `public/` folder
   - ✅ `package.json`
   - ✅ جميع الملفات الأخرى

---

## الخطوة التالية: النشر على Vercel

بعد رفع المشروع إلى GitHub بنجاح:
1. اذهب إلى: https://vercel.com/new
2. Import من GitHub
3. اختر المستودع `demo-islamic-library`
4. Deploy! 🚀

---

## ❓ مشاكل شائعة:

### إذا ظهرت رسالة "remote origin already exists":
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/demo-islamic-library.git
```

### إذا ظهرت رسالة "failed to push":
- تأكد من أن المستودع موجود على GitHub
- تأكد من أن الرابط صحيح
- تأكد من أنك مسجل دخول في git

### إذا لم تظهر الملفات على GitHub:
```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```


