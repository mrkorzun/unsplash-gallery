<div dir="rtl">

# عرض أنماط الترقيم: Load More و Infinite Scroll و Page Numbers

**🌐 اللغة:** [English](./README.md) · [Українська](./README.ua.md) · [Русский](./README.ru.md) ·
[Español](./README.es.md) · **العربية**

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-multi--page-646CFF?style=flat-square&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Unsplash API](https://img.shields.io/badge/Unsplash-API-000000?style=flat-square&logo=unsplash&logoColor=white)
![IntersectionObserver](https://img.shields.io/badge/IntersectionObserver-Web_API-success?style=flat-square)
![Prettier](https://img.shields.io/badge/Prettier-formatted-F7B93E?style=flat-square&logo=prettier&logoColor=black)

> مقارنة جنباً إلى جنب بين **ثلاث استراتيجيات ترقيم واقعية** — Load More و Infinite Scroll و Page Numbers — منفّذة فوق
> واجهة Unsplash REST API. كلّ نسخة تعيش في صفحتها الخاصة وتشترك في طبقة API وعرض موحّدة، فالفرق هنا في **فلسفة تجربة
> المستخدم والمقايضات**، لا في الكود الشكلي المتكرّر.

🔗 **العرض المباشر:** [mrkorzun.github.io/unsplash-gallery](https://mrkorzun.github.io/unsplash-gallery/)

![Preview](./preview.jpg)

---

## 🎯 ما الذي يُظهره هذا المشروع

يبدو الترقيم موضوعاً مملاً إلى أن يحين وقت اختيار إحدى تنفيذاته. يأخذ هذا المشروع ثلاثاً من أكثر الاستراتيجيات شيوعاً في
تطبيقات الإنتاج، يبني كل واحدة منها فوق واجهة API حقيقية، ويعاملها بوصفها **سطح تعلّم واحداً**: متى يبدو كلّ نهج
مناسباً، وما الحالة التي يحتاج تتبّعها، وما الحالات الحدّية في تجربة المستخدم التي يخفيها.

| الصفحة            | الاستراتيجية        | أمثلة من العالم الحقيقي                   | التقنية الأساسية                         |
| ----------------- | ------------------- | ----------------------------------------- | ---------------------------------------- |
| `01-gallery.html` | زرّ **Load More**   | Pixabay، صفحات وسوم Stack Overflow        | تشغيل يدوي من المستخدم، عدّاد للصفحة     |
| `02-gallery.html` | **Infinite Scroll** | خلاصات Twitter/X و Instagram              | `IntersectionObserver` على عنصر sentinel |
| `03-gallery.html` | **أرقام الصفحات**   | بحث Google، كاتالوجات التجارة الإلكترونية | تنقّل مباشر، حسابات `totalPages`         |

هذه البنية الثلاثية في مشروع واحد مقصودة — حين يسأل مسؤول التوظيف أو المُقابِل: "متى تختار infinite scroll مقابل أرقام
الصفحات؟"، فإنّ المشروع نفسه هو الإجابة.

---

## 💡 المهارات والكفاءات

### 🔹 استهلاك REST API — Unsplash

- التعامل مع **واجهة Unsplash** — مصادقة بمفتاح Access Key، معاملات استعلام (`query`، `page`، `per_page`،
  `orientation`).
- قراءة وثائق الواجهة ومطابقة شكل الطلب/الردّ مع احتياجات الواجهة.
- معالجة `total_pages` لمنطق نهاية المجموعة.
- تحليل دفاعي للهياكل المتداخلة في الردّ (`response.data.results`).

### 🔹 عميل HTTP والتدفّق غير المتزامن

- **Axios** كطبقة HTTP بإعداد مركزي للطلبات.
- **`async/await`** مع `try/catch/finally` لإدارة نظيفة لدورة الحياة.
- ظهور اللودر مرتبط بحدود الطلب — لا تبدو الواجهة متجمّدة أبداً.

### 🔹 ثلاث استراتيجيات للترقيم

**Load More (الصفحة 01)**

- الإيقاع تحت سيطرة المستخدم عبر زرّ.
- عدّاد الصفحة محفوظ في حالة على مستوى الوحدة.
- إعادة تعيين عند كلّ بحث جديد لمنع أخطاء الإزاحة القديمة.
- تمرير سلس عند كلّ تحميل.

**Infinite Scroll (الصفحة 02)**

- **`IntersectionObserver`** يراقب عنصر sentinel أسفل المعرض.
- جلب تلقائي للصفحة التالية عند دخول الـ sentinel إلى الـ viewport.
- يُفصَل المراقب عند نفاد المجموعة — دون نداءات مهدورة.
- يبقى اللودر ظاهراً فقط أثناء الطلبات الجارية.

**أرقام الصفحات (الصفحة 03)**

- ترقيم رقمي كلاسيكي بأزرار Previous / Next + أزرار رقمية.
- الصفحة النشطة مُبرَزة، ومنطق الأولى / الأخيرة / الحالية يُعالَج صراحةً.
- يحسب `totalPages = Math.ceil(total / per_page)` ويعرض وفقاً لذلك.
- قفزات مباشرة إلى الصفحة المطلوبة — دون الحاجة للتنقّل وصولاً إلى الصفحة 7.

### 🔹 تطبيق Vite متعدّد الصفحات

- كلّ استراتيجية ترقيم لها HTML entry-point خاص في `pages/`.
- إعداد `vite.config.js` بمسارات متعدّدة في `rollupOptions.input`.
- وحدات مشتركة تُستورَد في الصفحات الثلاث — اكتُب مرة، استخدم ثلاث مرات.

### 🔹 البنية المعيارية

- فصل واضح بين **طبقة API** و**طبقة العرض** و**متحكّمات الصفحات**.
- ملف JS لكل صفحة هو سكربت تنسيق رفيع — والثقل يقع على الوحدات المشتركة.
- وحدات ES بـ `import`/`export` صريحَين، صفر متغيّرات عامّة.

### 🔹 جودة تجربة المستخدم في الصفحات الثلاث

- **iziToast** للنتائج الفارغة والأخطاء ورسائل نهاية المجموعة.
- **SimpleLightbox** لمعاينة الصور بحجمها الكامل مع `lightbox.refresh()` بعد كلّ عرض.
- التحقّق من حقل البحث مع تغذية راجعة للمستخدم.
- لودر، وتمرير سلس، وحالات معطّلة.

### 🔹 البناء والأدوات والنشر

- خادم تطوير **Vite** مع HMR وبناء إنتاج متعدّد الصفحات.
- workflow في **GitHub Actions** يبني وينشر تلقائياً إلى **GitHub Pages** عند كلّ push إلى `main`.
- **Prettier** + **EditorConfig** لتنسيق متّسق على نمط فِرَق العمل.
- **Git** بسجلّ كوميتات نظيف وذرّي.

---

## 🧩 استعراض الوظائف

### الاستراتيجية 1 — Load More

المستخدم يتحكّم بوقت وصول البيانات الجديدة. الأنسب حين قد يرغب المستخدم بالتوقّف ليقرأ أو يقارن العناصر في مكانها — لا
ينبغي أن يسحب الترقيم الصفحة من تحت قدميه.

```js
loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();
  try {
    const { results, total_pages } = await getImagesByQuery(query, page);
    appendGallery(results);
    smoothScrollByCardHeight();
    if (page >= total_pages) {
      hideLoadMoreButton();
      iziToast.info({ message: "You've reached the end of search results." });
    }
  } finally {
    hideLoader();
  }
});
```

---

### الاستراتيجية 2 — Infinite Scroll (IntersectionObserver)

الأكثر حداثةً بين الثلاث. بدلاً من الارتباط بـ `window.scroll` وإعادة حساب الإزاحات باستمرار (الطريقة القديمة
المُكلِفة)، يراقب `IntersectionObserver` عنصر sentinel صغيراً موضوعاً تحت المعرض — ولحظة دخوله الـ viewport يُجلَب
الصفحة التالية.

هذا النمط **صديق للأداء، تصريحي، وقابل للإلغاء** — افصل المراقب عند انتهاء البيانات لتُنهي دورة الحياة بنظافة.

```js
const sentinel = document.querySelector('.sentinel');

const observer = new IntersectionObserver(
  async ([entry]) => {
    if (!entry.isIntersecting) return;

    page += 1;
    showLoader();
    try {
      const { results, total_pages } = await getImagesByQuery(query, page);
      appendGallery(results);
      if (page >= total_pages) {
        observer.disconnect();
        iziToast.info({ message: "You've reached the end of search results." });
      }
    } finally {
      hideLoader();
    }
  },
  { rootMargin: '300px' }
);

observer.observe(sentinel);
```

---

### الاستراتيجية 3 — أرقام الصفحات

الكلاسيكية. الأنسب حين يحتاج المستخدمون **القفز مباشرةً** إلى صفحة معيّنة — كاتالوجات، أرشيفات، نتائج بحث يضيفها
المستخدمون إلى الإشارات المرجعية أو يشاركونها. تتطلّب حسابات أكثر مسبقاً (`totalPages`) لكنّها تُقدّم نموذج التنقّل
الأكثر قابلية للتوقّع.

```js
function renderPagination(currentPage, totalPages) {
  paginationEl.innerHTML = '';

  // Previous
  paginationEl.append(makeButton('‹', currentPage > 1, currentPage - 1));

  // أزرار رقمية (مع حالة نشطة)
  for (let i = 1; i <= totalPages; i += 1) {
    const btn = makeButton(i, true, i);
    if (i === currentPage) btn.classList.add('is-active');
    paginationEl.append(btn);
  }

  // Next
  paginationEl.append(makeButton('›', currentPage < totalPages, currentPage + 1));
}

paginationEl.addEventListener('click', async e => {
  const targetPage = Number(e.target.dataset.page);
  if (!targetPage || targetPage === page) return;

  page = targetPage;
  showLoader();
  try {
    const { results } = await getImagesByQuery(query, page);
    replaceGallery(results);
    renderPagination(page, totalPages);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    hideLoader();
  }
});
```

---

## 🚀 التشغيل محلياً

```bash
git clone https://github.com/mrkorzun/unsplash-gallery.git
cd unsplash-gallery
npm install
npm run dev
```

> **ملاحظة:** يحتاج المشروع إلى مفتاح Access Key لواجهة Unsplash. سجّل تطبيق مطوّر مجاني على
> [unsplash.com/developers](https://unsplash.com/developers) وأضِف المفتاح إلى ملفّ `.env` بالشكل
> `VITE_UNSPLASH_ACCESS_KEY=your_key_here`.

سيطبع خادم التطوير عنواناً محلياً (عادةً `http://localhost:5173`).

### بناء الإنتاج والنشر

```bash
npm run build       # يبني إلى ./dist
npm run preview     # يُشغّل بناء الإنتاج محلياً
```

كلّ push إلى `main` يُشغّل workflow في `.github/workflows`، الذي يبني وينشر تلقائياً إلى فرع `gh-pages`.

---

## 📁 بنية المشروع

```
unsplash-gallery/
├── .github/workflows/        # نشر تلقائي إلى GitHub Pages
├── src/
│   ├── js/
│   │   ├── unsplash-api.js       # طبقة API — طلبات Axios
│   │   └── render-functions.js   # طبقة العرض — DOM و lightbox والمعرض
│   ├── css/
│   ├── pages/
│   │   ├── 01-gallery.html       # Load More
│   │   ├── 02-gallery.html       # Infinite Scroll
│   │   └── 03-gallery.html       # أرقام الصفحات
│   └── main.js                   # منطق صفحة الهبوط
├── index.html                    # مركز التنقل
├── .editorconfig
├── .prettierrc.json
├── package.json
├── vite.config.js                # إعداد Vite متعدّد الصفحات
└── README.md
```

---

## 👤 المؤلف

**Romario Korzun** — مطوّر واجهات أمامية

- GitHub: [@mrkorzun](https://github.com/mrkorzun)
- الصفحة الشخصية: [mrkorzun.github.io](https://mrkorzun.github.io)

---

<sub>أُنشئ في الأصل كتمرين عملي ضمن منهج **GoIT JavaScript**، توسيعاً لمشاريع سابقة للبحث عن الصور بهدف المقارنة جنباً
إلى جنب بين ثلاث استراتيجيات للترقيم.</sub>

</div>
