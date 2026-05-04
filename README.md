# Pagination Patterns Showcase: Load More, Infinite Scroll & Page Numbers

**🌐 Language:** **English** · [Українська](./README.ua.md) · [Русский](./README.ru.md) · [Español](./README.es.md) ·
[العربية](./README.ar.md)

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-multi--page-646CFF?style=flat-square&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Unsplash API](https://img.shields.io/badge/Unsplash-API-000000?style=flat-square&logo=unsplash&logoColor=white)
![IntersectionObserver](https://img.shields.io/badge/IntersectionObserver-Web_API-success?style=flat-square)
![Prettier](https://img.shields.io/badge/Prettier-formatted-F7B93E?style=flat-square&logo=prettier&logoColor=black)

> A side-by-side comparison of **three real-world pagination strategies** — Load More, Infinite Scroll, and Page Numbers
> — implemented against the Unsplash REST API. Each variant lives on its own page, sharing a common API and view layer,
> so the differences are about **UX philosophy and trade-offs**, not boilerplate.

🔗 **Live demo:** [mrkorzun.github.io/unsplash-gallery](https://mrkorzun.github.io/unsplash-gallery/)

![Preview](./preview.jpg)

---

## 🎯 What This Project Demonstrates

Pagination sounds boring until you have to choose one. This project picks three of the most common strategies in
production apps, builds each one against a real API, and treats them as **a single learning surface**: when does each
one feel right, what state do they need to track, and what UX edge cases do they hide?

| Page              | Strategy             | Real-world examples                | Key technique                             |
| ----------------- | -------------------- | ---------------------------------- | ----------------------------------------- |
| `01-gallery.html` | **Load More** button | Pixabay, Stack Overflow tag pages  | Manual user trigger, page counter         |
| `02-gallery.html` | **Infinite Scroll**  | Twitter/X, Instagram feeds         | `IntersectionObserver` on a sentinel      |
| `03-gallery.html` | **Page Numbers**     | Google Search, e-commerce catalogs | Direct page navigation, `totalPages` math |

This three-in-one structure is intentional — a recruiter or interviewer can ask "when would you use infinite scroll vs.
page numbers?" and the project itself is the answer.

---

## 💡 Skills & Competencies

### 🔹 REST API Consumption — Unsplash

- Working with the **Unsplash API** — Access Key authentication, query parameters (`query`, `page`, `per_page`,
  `orientation`).
- Reading API documentation and matching request/response shapes to UI needs.
- Handling `total_pages` for end-of-collection logic.
- Defensive parsing of nested response structures (`response.data.results`).

### 🔹 HTTP Client & Async Flow

- **Axios** as the HTTP layer with centralized request configuration.
- **`async/await`** with `try/catch/finally` for clean lifecycle management.
- Loader visibility tied to request boundaries — the UI never feels frozen.

### 🔹 Three Pagination Strategies

**Load More (page 01)**

- User-controlled pacing via a button.
- Page counter held in module-level state.
- Reset on every new search to prevent stale offset bugs.
- Smooth scroll on each load.

**Infinite Scroll (page 02)**

- **`IntersectionObserver`** watching a sentinel element below the gallery.
- Auto-fetches the next page when the sentinel enters the viewport.
- Observer is disconnected when the collection is exhausted — no wasted callbacks.
- Loader remains visible only during in-flight requests.

**Page Numbers (page 03)**

- Classic numbered pagination with Previous / Next + numeric buttons.
- Active page highlighted; first / last / current page logic handled explicitly.
- Calculates `totalPages = Math.ceil(total / per_page)` and renders accordingly.
- Direct page jumps — no "load through to page 7" required.

### 🔹 Multi-Page Vite Application

- Each pagination strategy is its own HTML entry point under `pages/`.
- `vite.config.js` configured with multiple `rollupOptions.input` paths.
- Shared modules imported across all three pages — write once, use thrice.

### 🔹 Modular Architecture

- Clear separation between **API layer**, **render layer**, and **page-specific controllers**.
- Each page's JS is a thin orchestration script — the heavy lifting lives in shared modules.
- ES Modules with explicit `import`/`export`, zero globals.

### 🔹 UX Polish Across All Three Pages

- **iziToast** for empty results, errors, and end-of-collection messaging.
- **SimpleLightbox** for full-size preview with `lightbox.refresh()` after each render.
- Search input validation with user feedback.
- Loaders, smooth scrolling, disabled states.

### 🔹 Build, Tooling & Deployment

- **Vite** dev server with HMR and multi-page production build.
- **GitHub Actions** workflow auto-builds and deploys to **GitHub Pages** on every push to `main`.
- **Prettier** + **EditorConfig** for consistent formatting across team-style workflows.
- **Git** with a clean, atomic commit history.

---

## 🧩 Feature Walkthrough

### Strategy 1 — Load More

The user controls when more data arrives. Best when the user might want to stop and read or compare items in place —
pagination shouldn't yank the page out from under them.

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

### Strategy 2 — Infinite Scroll (IntersectionObserver)

The most modern of the three. Instead of attaching to `window.scroll` and constantly recalculating offsets (the old,
expensive way), an `IntersectionObserver` watches a small sentinel element placed after the gallery — the moment that
sentinel enters the viewport, the next page is fetched.

This pattern is **performance-friendly, declarative, and cancellable** — disconnect the observer when there's nothing
left to load, and you've cleanly ended the lifecycle.

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

### Strategy 3 — Page Numbers

The classic. Best when users need to **jump directly** to a specific page — catalogs, archives, search results where
users bookmark or share specific pages. Requires more upfront math (`totalPages`), but delivers the most predictable
navigation model.

```js
function renderPagination(currentPage, totalPages) {
  paginationEl.innerHTML = '';

  // Previous
  paginationEl.append(makeButton('‹', currentPage > 1, currentPage - 1));

  // Numeric buttons (with active state)
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

## 🚀 Running Locally

```bash
git clone https://github.com/mrkorzun/unsplash-gallery.git
cd unsplash-gallery
npm install
npm run dev
```

> **Note:** This project requires an Unsplash API access key. Register a free developer app at
> [unsplash.com/developers](https://unsplash.com/developers) and add the key to a `.env` file as
> `VITE_UNSPLASH_ACCESS_KEY=your_key_here`.

The dev server will print a local URL (usually `http://localhost:5173`).

### Production build & deploy

```bash
npm run build       # builds into ./dist
npm run preview     # serves the production build locally
```

Pushing to `main` triggers the GitHub Actions workflow under `.github/workflows`, which builds and deploys to the
`gh-pages` branch automatically.

---

## 📁 Project Structure

```
unsplash-gallery/
├── .github/workflows/        # Auto-deploy to GitHub Pages
├── src/
│   ├── js/
│   │   ├── unsplash-api.js       # API layer — Axios calls
│   │   └── render-functions.js   # View layer — DOM, lightbox, gallery
│   ├── css/
│   ├── pages/
│   │   ├── 01-gallery.html       # Load More
│   │   ├── 02-gallery.html       # Infinite Scroll
│   │   └── 03-gallery.html       # Page Numbers
│   └── main.js                   # Landing page logic
├── index.html                    # Navigation hub
├── .editorconfig
├── .prettierrc.json
├── package.json
├── vite.config.js                # Multi-page Vite configuration
└── README.md
```

---

## 👤 Author

**Romario Korzun** — Front-End Developer

- GitHub: [@mrkorzun](https://github.com/mrkorzun)
- Portfolio: [mrkorzun.github.io](https://mrkorzun.github.io)

---

<sub>Originally built as a practical exercise within the **GoIT JavaScript** curriculum, expanding on earlier
image-search projects to compare three pagination strategies side by side.</sub>
