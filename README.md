# omarhardani.com

موقع عمر الحردان الشخصي. مبني بـ Astro، ويُنشر على Netlify تلقائياً عند كل تعديل في GitHub.

## أين أعدّل؟

| ماذا | أين |
|---|---|
| كتابة مقال جديد | لوحة الكتابة: `omarhardani.com/admin/` (بدون كود) |
| الروابط والإعدادات (Udemy، البريد، مفتاح YouTube، الشعارات) | `public/assets/js/config.js` |
| النصوص العربية | `src/pages/*.astro` |
| النصوص الإنجليزية | `public/assets/js/i18n.js` |
| القائمة العلوية والتذييل | `src/layouts/Base.astro` |
| التصميم (ألوان، خطوط، مسافات) | `public/assets/css/style.css` |
| قائمة الفيديوهات اليدوية (بدون مفتاح YouTube) | `public/data/videos.js` |
| ملفات المقالات | `src/content/blog/*.md` |

## المدونة

- كل مقال ملف في `src/content/blog/`. لوحة الكتابة تنشئه لك.
- المقال المعلَّم «مسودة» لا يظهر في الموقع.
- صفحة المدونة تعرض «قريباً» ما دام لا يوجد مقال منشور.
- `sample-post.md` مقال تجريبي (مسودة). احذفه عند نشر أول مقال.

## الفيديوهات

- مع مفتاح YouTube في `config.js`: تتحدّث تلقائياً، وتُفصل الفيديوهات الطويلة عن المقاطع القصيرة.
- بدون مفتاح: تُعرض القائمة في `public/data/videos.js`.

## للمطوّرين

```
npm install
npm run dev      # معاينة محلية
npm run build    # ينتج مجلد dist
```

إعدادات لوحة الكتابة في `public/admin/config.yml` (يجب وضع اسم مستودع GitHub فيها).
