# Демонстрація Патернів Пагінації: Load More, Infinite Scroll та Page Numbers

**🌐 Мова:** [English](./README.md) · **Українська** · [Русский](./README.ru.md) · [Español](./README.es.md) ·
[العربية](./README.ar.md)

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-multi--page-646CFF?style=flat-square&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Unsplash API](https://img.shields.io/badge/Unsplash-API-000000?style=flat-square&logo=unsplash&logoColor=white)
![IntersectionObserver](https://img.shields.io/badge/IntersectionObserver-Web_API-success?style=flat-square)
![Prettier](https://img.shields.io/badge/Prettier-formatted-F7B93E?style=flat-square&logo=prettier&logoColor=black)

> Порівняльна реалізація **трьох найпоширеніших патернів пагінації** — Load More, Infinite Scroll та Page Numbers — на
> базі Unsplash REST API. Кожен варіант живе на своїй сторінці й використовує спільний API- та view-шар, тому різниця
> тут саме в **UX-філософії та компромісах**, а не в шаблонному коді.

🔗 **Жива демо-версія:** [mrkorzun.github.io/unsplash-gallery](https://mrkorzun.github.io/unsplash-gallery/)

![Preview](./preview.jpg)

---

## 🎯 Що демонструє цей проєкт

Пагінація здається нудною темою, поки не настане момент обирати одну з реалізацій. У цьому проєкті взято три
найпоширеніші стратегії з production-додатків, побудовано кожну поверх реального API і подано їх як **єдиний навчальний
майданчик**: коли який підхід відчувається доречним, який стан він потребує і які UX-нюанси приховані всередині.

| Сторінка          | Стратегія            | Реальні приклади                   | Ключова техніка                               |
| ----------------- | -------------------- | ---------------------------------- | --------------------------------------------- |
| `01-gallery.html` | **Load More** кнопка | Pixabay, Stack Overflow tag pages  | Ручний тригер користувача, лічильник сторінки |
| `02-gallery.html` | **Infinite Scroll**  | Twitter/X, стрічки Instagram       | `IntersectionObserver` на sentinel-елементі   |
| `03-gallery.html` | **Номери сторінок**  | Google Search, e-commerce каталоги | Пряма навігація + математика `totalPages`     |

Структура «три-в-одному» свідома: коли рекрутер чи інтерв'юер запитає «коли ти оберіш infinite scroll, а коли — номери
сторінок?» — сам проєкт є відповіддю.

---

## 💡 Навички та компетенції

### 🔹 Споживання REST API — Unsplash

- Робота з **Unsplash API** — авторизація через Access Key, query-параметри (`query`, `page`, `per_page`,
  `orientation`).
- Читання документації API і зіставлення форми запиту/відповіді з потребами UI.
- Обробка `total_pages` для логіки кінця колекції.
- Захисний парсинг вкладених структур відповіді (`response.data.results`).

### 🔹 HTTP-клієнт та асинхронний потік

- **Axios** як HTTP-шар з централізованою конфігурацією запитів.
- **`async/await`** з `try/catch/finally` для чистого керування життєвим циклом.
- Видимість лоадера прив'язана до меж запиту — UI ніколи не виглядає замороженим.

### 🔹 Три стратегії пагінації

**Load More (сторінка 01)**

- Темп задає користувач — через кнопку.
- Лічильник сторінки в стейті на рівні модуля.
- Скидання при кожному новому пошуку, щоб уникнути багів зі застарілим offset'ом.
- Плавне прокручування при кожному завантаженні.

**Infinite Scroll (сторінка 02)**

- **`IntersectionObserver`** спостерігає за sentinel-елементом під галереєю.
- Автоматично завантажує наступну сторінку, коли sentinel входить у viewport.
- Observer відключається, коли колекція вичерпана — без зайвих коллбеків.
- Лоадер показується лише під час активного запиту.

**Номери сторінок (сторінка 03)**

- Класична нумерована пагінація з кнопками Previous / Next + цифровими кнопками.
- Активна сторінка підсвічена; перша / остання / поточна обробляються явно.
- Розраховує `totalPages = Math.ceil(total / per_page)` і рендерить відповідно.
- Прямі переходи на конкретну сторінку — не треба «гортати до сторінки 7».

### 🔹 Багато-сторінковий Vite-застосунок

- Кожна стратегія пагінації — окремий HTML entry-point у `pages/`.
- `vite.config.js` налаштовано з кількома шляхами в `rollupOptions.input`.
- Спільні модулі імпортуються в усі три сторінки — пишемо один раз, використовуємо тричі.

### 🔹 Модульна архітектура

- Чітке розділення між **API-шаром**, **render-шаром** і **контролерами окремих сторінок**.
- JS кожної сторінки — це тонкий orchestration-скрипт, важка логіка живе в спільних модулях.
- ES-модулі з явними `import`/`export`, без жодних глобалок.

### 🔹 UX-якість на всіх трьох сторінках

- **iziToast** для порожніх результатів, помилок і кінця колекції.
- **SimpleLightbox** для повнорозмірного перегляду з `lightbox.refresh()` після кожного рендеру.
- Валідація поля пошуку з фідбеком користувачу.
- Лоадери, плавне прокручування, disabled-стани.

### 🔹 Збірка, тулінг та деплой

- **Vite** dev-сервер з HMR і multi-page production-збіркою.
- **GitHub Actions** workflow автоматично збирає і деплоїть на **GitHub Pages** при кожному push'і в `main`.
- **Prettier** + **EditorConfig** для уніфікованого форматування у командному стилі.
- **Git** з чистою, атомарною історією комітів.

---

## 🧩 Розбір функціональності

### Стратегія 1 — Load More

Користувач сам контролює, коли надходять нові дані. Найкраще підходить, коли користувач може захотіти зупинитися й
порівняти або прочитати елементи на місці — пагінація не повинна вибивати сторінку з-під нього.

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

### Стратегія 2 — Infinite Scroll (IntersectionObserver)

Найсучасніша з трьох. Замість того щоб слухати `window.scroll` і постійно перераховувати offset'и (старий і дорогий за
продуктивністю спосіб), `IntersectionObserver` спостерігає за маленьким sentinel-елементом, розташованим під галереєю —
щойно sentinel входить у viewport, підвантажується наступна сторінка.

Цей патерн **дружній до продуктивності, декларативний і легко скасовується** — від'єднай observer, коли більше нічого
вантажити, і ти чисто завершив життєвий цикл.

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

### Стратегія 3 — Номери сторінок

Класика. Найкраще, коли користувачам потрібно **стрибати напряму** на конкретну сторінку — каталоги, архіви, результати
пошуку, які користувачі додають у закладки чи шерять. Потребує більше математики наперед (`totalPages`), але дає
найпередбачуванішу модель навігації.

```js
function renderPagination(currentPage, totalPages) {
  paginationEl.innerHTML = '';

  // Previous
  paginationEl.append(makeButton('‹', currentPage > 1, currentPage - 1));

  // Цифрові кнопки (з активним станом)
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

## 🚀 Локальний запуск

```bash
git clone https://github.com/mrkorzun/unsplash-gallery.git
cd unsplash-gallery
npm install
npm run dev
```

> **Зверни увагу:** проєкт потребує Access Key від Unsplash API. Зареєструй безкоштовний developer-додаток на
> [unsplash.com/developers](https://unsplash.com/developers) і додай ключ у файл `.env` як
> `VITE_UNSPLASH_ACCESS_KEY=your_key_here`.

Dev-сервер виведе локальну адресу (зазвичай `http://localhost:5173`).

### Production-збірка та деплой

```bash
npm run build       # збирає у ./dist
npm run preview     # піднімає production-збірку локально
```

Push у `main` запускає GitHub Actions workflow з `.github/workflows`, який автоматично збирає і деплоїть у гілку
`gh-pages`.

---

## 📁 Структура проєкту

```
unsplash-gallery/
├── .github/workflows/        # Автодеплой на GitHub Pages
├── src/
│   ├── js/
│   │   ├── unsplash-api.js       # API-шар — Axios-запити
│   │   └── render-functions.js   # View-шар — DOM, lightbox, галерея
│   ├── css/
│   ├── pages/
│   │   ├── 01-gallery.html       # Load More
│   │   ├── 02-gallery.html       # Infinite Scroll
│   │   └── 03-gallery.html       # Номери сторінок
│   └── main.js                   # Логіка стартової сторінки
├── index.html                    # Хаб навігації
├── .editorconfig
├── .prettierrc.json
├── package.json
├── vite.config.js                # Multi-page Vite конфігурація
└── README.md
```

---

## 👤 Автор

**Romario Korzun** — Front-End Developer

- GitHub: [@mrkorzun](https://github.com/mrkorzun)
- Жива сторінка: [mrkorzun.github.io](https://mrkorzun.github.io)

---

<sub>Початково створено як практична вправа в межах курсу **GoIT JavaScript**, як розширення попередніх проєктів пошуку
зображень для порівняльного аналізу трьох стратегій пагінації.</sub>
