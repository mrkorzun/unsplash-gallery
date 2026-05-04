# Демонстрация Паттернов Пагинации: Load More, Infinite Scroll и Page Numbers

**🌐 Язык:** [English](./README.md) · [Українська](./README.ua.md) · **Русский** · [Español](./README.es.md) ·
[العربية](./README.ar.md)

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-multi--page-646CFF?style=flat-square&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Unsplash API](https://img.shields.io/badge/Unsplash-API-000000?style=flat-square&logo=unsplash&logoColor=white)
![IntersectionObserver](https://img.shields.io/badge/IntersectionObserver-Web_API-success?style=flat-square)
![Prettier](https://img.shields.io/badge/Prettier-formatted-F7B93E?style=flat-square&logo=prettier&logoColor=black)

> Сравнительная реализация **трёх самых распространённых паттернов пагинации** — Load More, Infinite Scroll и Page
> Numbers — на базе Unsplash REST API. Каждый вариант живёт на своей странице и использует общий API- и view-слой,
> поэтому разница здесь именно в **UX-философии и компромиссах**, а не в шаблонном коде.

🔗 **Живая демо-версия:** [mrkorzun.github.io/unsplash-gallery](https://mrkorzun.github.io/unsplash-gallery/)

![Preview](./preview.jpg)

---

## 🎯 Что демонстрирует этот проект

Пагинация кажется скучной темой, пока не настанет момент выбирать одну из реализаций. В этом проекте взяты три самые
распространённые стратегии из production-приложений, каждая построена поверх настоящего API, и поданы они как **единая
обучающая площадка**: когда какой подход ощущается уместным, какое состояние он требует и какие UX-нюансы скрыты внутри.

| Страница          | Стратегия            | Реальные примеры                   | Ключевая техника                              |
| ----------------- | -------------------- | ---------------------------------- | --------------------------------------------- |
| `01-gallery.html` | **Load More** кнопка | Pixabay, Stack Overflow tag pages  | Ручной триггер пользователя, счётчик страницы |
| `02-gallery.html` | **Infinite Scroll**  | Twitter/X, ленты Instagram         | `IntersectionObserver` на sentinel-элементе   |
| `03-gallery.html` | **Номера страниц**   | Google Search, e-commerce каталоги | Прямая навигация + математика `totalPages`    |

Структура «три-в-одном» осознанная: когда рекрутер или интервьюер спросит «когда ты выберешь infinite scroll, а когда —
номера страниц?» — сам проект и есть ответ.

---

## 💡 Навыки и компетенции

### 🔹 Потребление REST API — Unsplash

- Работа с **Unsplash API** — авторизация через Access Key, query-параметры (`query`, `page`, `per_page`,
  `orientation`).
- Чтение документации API и сопоставление формы запроса/ответа с потребностями UI.
- Обработка `total_pages` для логики конца коллекции.
- Защитный парсинг вложенных структур ответа (`response.data.results`).

### 🔹 HTTP-клиент и асинхронный поток

- **Axios** как HTTP-слой с централизованной конфигурацией запросов.
- **`async/await`** с `try/catch/finally` для чистого управления жизненным циклом.
- Видимость лоадера привязана к границам запроса — UI никогда не выглядит замороженным.

### 🔹 Три стратегии пагинации

**Load More (страница 01)**

- Темп задаёт пользователь — через кнопку.
- Счётчик страницы в стейте на уровне модуля.
- Сброс при каждом новом поиске, чтобы избежать багов с устаревшим offset'ом.
- Плавное прокручивание при каждой загрузке.

**Infinite Scroll (страница 02)**

- **`IntersectionObserver`** наблюдает за sentinel-элементом под галереей.
- Автоматически загружает следующую страницу, когда sentinel входит в viewport.
- Observer отключается, когда коллекция исчерпана — без лишних коллбэков.
- Лоадер показывается только во время активного запроса.

**Номера страниц (страница 03)**

- Классическая нумерованная пагинация с кнопками Previous / Next + цифровыми кнопками.
- Активная страница подсвечена; первая / последняя / текущая обрабатываются явно.
- Рассчитывает `totalPages = Math.ceil(total / per_page)` и рендерит соответственно.
- Прямые переходы на конкретную страницу — не нужно «пролистывать до страницы 7».

### 🔹 Многостраничное Vite-приложение

- Каждая стратегия пагинации — отдельный HTML entry-point в `pages/`.
- `vite.config.js` настроен с несколькими путями в `rollupOptions.input`.
- Общие модули импортируются во все три страницы — пишем один раз, используем трижды.

### 🔹 Модульная архитектура

- Чёткое разделение между **API-слоем**, **render-слоем** и **контроллерами отдельных страниц**.
- JS каждой страницы — это тонкий orchestration-скрипт, тяжёлая логика живёт в общих модулях.
- ES-модули с явными `import`/`export`, без каких-либо глобалок.

### 🔹 UX-качество на всех трёх страницах

- **iziToast** для пустых результатов, ошибок и конца коллекции.
- **SimpleLightbox** для полноразмерного просмотра с `lightbox.refresh()` после каждого рендера.
- Валидация поля поиска с фидбеком пользователю.
- Лоадеры, плавное прокручивание, disabled-состояния.

### 🔹 Сборка, тулинг и деплой

- **Vite** dev-сервер с HMR и multi-page production-сборкой.
- **GitHub Actions** workflow автоматически собирает и деплоит на **GitHub Pages** при каждом push'е в `main`.
- **Prettier** + **EditorConfig** для единого форматирования в командном стиле.
- **Git** с чистой, атомарной историей коммитов.

---

## 🧩 Разбор функциональности

### Стратегия 1 — Load More

Пользователь сам контролирует, когда поступают новые данные. Лучше всего подходит, когда пользователь может захотеть
остановиться и сравнить или прочитать элементы на месте — пагинация не должна выбивать страницу из-под него.

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

### Стратегия 2 — Infinite Scroll (IntersectionObserver)

Самая современная из трёх. Вместо того чтобы слушать `window.scroll` и постоянно пересчитывать offset'ы (старый и
дорогой по производительности способ), `IntersectionObserver` наблюдает за маленьким sentinel-элементом, расположенным
под галереей — как только sentinel входит в viewport, подгружается следующая страница.

Этот паттерн **дружелюбен к производительности, декларативен и легко отменяется** — отсоедини observer, когда больше
нечего грузить, и ты чисто завершил жизненный цикл.

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

### Стратегия 3 — Номера страниц

Классика. Лучше всего, когда пользователям нужно **прыгать напрямую** на конкретную страницу — каталоги, архивы,
результаты поиска, которые пользователи добавляют в закладки или шерят. Требует больше математики заранее
(`totalPages`), но даёт самую предсказуемую модель навигации.

```js
function renderPagination(currentPage, totalPages) {
  paginationEl.innerHTML = '';

  // Previous
  paginationEl.append(makeButton('‹', currentPage > 1, currentPage - 1));

  // Цифровые кнопки (с активным состоянием)
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

## 🚀 Локальный запуск

```bash
git clone https://github.com/mrkorzun/unsplash-gallery.git
cd unsplash-gallery
npm install
npm run dev
```

> **Обрати внимание:** проекту нужен Access Key от Unsplash API. Зарегистрируй бесплатное developer-приложение на
> [unsplash.com/developers](https://unsplash.com/developers) и добавь ключ в файл `.env` как
> `VITE_UNSPLASH_ACCESS_KEY=your_key_here`.

Dev-сервер выведет локальный адрес (обычно `http://localhost:5173`).

### Production-сборка и деплой

```bash
npm run build       # собирает в ./dist
npm run preview     # поднимает production-сборку локально
```

Push в `main` запускает GitHub Actions workflow из `.github/workflows`, который автоматически собирает и деплоит в ветку
`gh-pages`.

---

## 📁 Структура проекта

```
unsplash-gallery/
├── .github/workflows/        # Автодеплой на GitHub Pages
├── src/
│   ├── js/
│   │   ├── unsplash-api.js       # API-слой — Axios-запросы
│   │   └── render-functions.js   # View-слой — DOM, lightbox, галерея
│   ├── css/
│   ├── pages/
│   │   ├── 01-gallery.html       # Load More
│   │   ├── 02-gallery.html       # Infinite Scroll
│   │   └── 03-gallery.html       # Номера страниц
│   └── main.js                   # Логика стартовой страницы
├── index.html                    # Хаб навигации
├── .editorconfig
├── .prettierrc.json
├── package.json
├── vite.config.js                # Multi-page Vite конфигурация
└── README.md
```

---

## 👤 Автор

**Romario Korzun** — Front-End Developer

- GitHub: [@mrkorzun](https://github.com/mrkorzun)
- Живая страница: [mrkorzun.github.io](https://mrkorzun.github.io)

---

<sub>Изначально создано как практическое упражнение в рамках курса **GoIT JavaScript**, как расширение предыдущих
проектов поиска изображений для сравнительного анализа трёх стратегий пагинации.</sub>
