# Showcase de Patrones de Paginación: Load More, Infinite Scroll y Page Numbers

**🌐 Idioma:** [English](./README.md) · [Українська](./README.ua.md) · [Русский](./README.ru.md) · **Español** ·
[العربية](./README.ar.md)

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-multi--page-646CFF?style=flat-square&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Unsplash API](https://img.shields.io/badge/Unsplash-API-000000?style=flat-square&logo=unsplash&logoColor=white)
![IntersectionObserver](https://img.shields.io/badge/IntersectionObserver-Web_API-success?style=flat-square)
![Prettier](https://img.shields.io/badge/Prettier-formatted-F7B93E?style=flat-square&logo=prettier&logoColor=black)

> Una comparación lado a lado de **tres estrategias de paginación del mundo real** — Load More, Infinite Scroll y Page
> Numbers — implementadas contra la API REST de Unsplash. Cada variante vive en su propia página y comparte una capa
> común de API y vista, así que las diferencias son sobre **filosofía UX y compromisos**, no sobre boilerplate.

🔗 **Demo en vivo:** [mrkorzun.github.io/unsplash-gallery](https://mrkorzun.github.io/unsplash-gallery/)

![Preview](./preview.jpg)

---

## 🎯 Qué demuestra este proyecto

La paginación parece aburrida hasta que toca elegir una. Este proyecto toma tres de las estrategias más comunes en
aplicaciones de producción, construye cada una contra una API real y las trata como **una única superficie de
aprendizaje**: cuándo se siente correcta cada una, qué estado necesitan rastrear y qué casos límite UX esconden.

| Página            | Estrategia            | Ejemplos del mundo real                    | Técnica clave                                    |
| ----------------- | --------------------- | ------------------------------------------ | ------------------------------------------------ |
| `01-gallery.html` | Botón **Load More**   | Pixabay, páginas de tags de Stack Overflow | Trigger manual del usuario, contador de página   |
| `02-gallery.html` | **Infinite Scroll**   | Feeds de Twitter/X, Instagram              | `IntersectionObserver` sobre un sentinel         |
| `03-gallery.html` | **Números de Página** | Google Search, catálogos e-commerce        | Navegación directa, matemáticas con `totalPages` |

Esta estructura de tres-en-uno es intencional — un reclutador o entrevistador puede preguntar "¿cuándo usarías infinite
scroll vs. números de página?" y el propio proyecto es la respuesta.

---

## 💡 Habilidades y competencias

### 🔹 Consumo de API REST — Unsplash

- Trabajo con la **API de Unsplash** — autenticación con Access Key, parámetros de query (`query`, `page`, `per_page`,
  `orientation`).
- Lectura de la documentación de la API y ajuste de la forma de petición/respuesta a las necesidades de la UI.
- Manejo de `total_pages` para la lógica de fin de colección.
- Parseo defensivo de estructuras de respuesta anidadas (`response.data.results`).

### 🔹 Cliente HTTP y flujo asíncrono

- **Axios** como capa HTTP con configuración centralizada de peticiones.
- **`async/await`** con `try/catch/finally` para gestión limpia del ciclo de vida.
- Visibilidad del loader vinculada a los límites de la petición — la UI nunca se siente congelada.

### 🔹 Tres estrategias de paginación

**Load More (página 01)**

- Ritmo controlado por el usuario mediante un botón.
- Contador de página en estado a nivel de módulo.
- Reset en cada nueva búsqueda para prevenir bugs por offset obsoleto.
- Scroll suave en cada carga.

**Infinite Scroll (página 02)**

- **`IntersectionObserver`** observando un elemento sentinel debajo de la galería.
- Auto-fetch de la siguiente página cuando el sentinel entra al viewport.
- El observer se desconecta cuando la colección se agota — sin callbacks desperdiciados.
- El loader permanece visible solo durante peticiones en vuelo.

**Números de página (página 03)**

- Paginación numérica clásica con botones Previous / Next + botones numéricos.
- Página activa resaltada; lógica de primera / última / actual manejada explícitamente.
- Calcula `totalPages = Math.ceil(total / per_page)` y renderiza acorde.
- Saltos directos a página — no hace falta "cargar hasta llegar a la página 7".

### 🔹 Aplicación Vite multipágina

- Cada estrategia de paginación es su propio HTML entry-point bajo `pages/`.
- `vite.config.js` configurado con múltiples rutas en `rollupOptions.input`.
- Módulos compartidos importados en las tres páginas — escribir una vez, usar tres veces.

### 🔹 Arquitectura modular

- Separación clara entre **capa API**, **capa de render** y **controladores específicos por página**.
- El JS de cada página es un script de orquestación delgado — el peso lo llevan los módulos compartidos.
- ES Modules con `import`/`export` explícitos, cero globales.

### 🔹 Calidad UX en las tres páginas

- **iziToast** para resultados vacíos, errores y mensajes de fin de colección.
- **SimpleLightbox** para previsualización a tamaño completo con `lightbox.refresh()` tras cada render.
- Validación del input de búsqueda con feedback al usuario.
- Loaders, scroll suave, estados deshabilitados.

### 🔹 Build, tooling y despliegue

- **Vite** dev server con HMR y build de producción multipágina.
- Workflow de **GitHub Actions** que construye y despliega automáticamente a **GitHub Pages** en cada push a `main`.
- **Prettier** + **EditorConfig** para formato consistente al estilo de equipo.
- **Git** con un historial de commits limpio y atómico.

---

## 🧩 Recorrido por las funcionalidades

### Estrategia 1 — Load More

El usuario controla cuándo llegan más datos. Mejor cuando el usuario podría querer detenerse y leer o comparar elementos
en su sitio — la paginación no debería sacarle la página de debajo.

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

### Estrategia 2 — Infinite Scroll (IntersectionObserver)

La más moderna de las tres. En lugar de engancharse a `window.scroll` y recalcular constantemente offsets (la forma
vieja y costosa), un `IntersectionObserver` observa un pequeño elemento sentinel colocado tras la galería — en el
momento en que ese sentinel entra al viewport, se hace fetch de la siguiente página.

Este patrón es **amigable con el rendimiento, declarativo y cancelable** — desconecta el observer cuando no quede nada
que cargar y habrás terminado limpiamente el ciclo de vida.

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

### Estrategia 3 — Números de página

La clásica. Mejor cuando los usuarios necesitan **saltar directamente** a una página específica — catálogos, archivos,
resultados de búsqueda donde los usuarios marcan o comparten páginas concretas. Requiere más matemáticas iniciales
(`totalPages`) pero entrega el modelo de navegación más predecible.

```js
function renderPagination(currentPage, totalPages) {
  paginationEl.innerHTML = '';

  // Previous
  paginationEl.append(makeButton('‹', currentPage > 1, currentPage - 1));

  // Botones numéricos (con estado activo)
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

## 🚀 Ejecución local

```bash
git clone https://github.com/mrkorzun/unsplash-gallery.git
cd unsplash-gallery
npm install
npm run dev
```

> **Nota:** este proyecto requiere un Access Key de la API de Unsplash. Registra una app de desarrollador gratis en
> [unsplash.com/developers](https://unsplash.com/developers) y añade la clave a un archivo `.env` como
> `VITE_UNSPLASH_ACCESS_KEY=tu_clave_aqui`.

El dev server imprimirá una URL local (normalmente `http://localhost:5173`).

### Build de producción y despliegue

```bash
npm run build       # genera ./dist
npm run preview     # sirve el build de producción localmente
```

Hacer push a `main` dispara el workflow de GitHub Actions en `.github/workflows`, que construye y despliega a la rama
`gh-pages` automáticamente.

---

## 📁 Estructura del proyecto

```
unsplash-gallery/
├── .github/workflows/        # Auto-despliegue en GitHub Pages
├── src/
│   ├── js/
│   │   ├── unsplash-api.js       # Capa API — peticiones Axios
│   │   └── render-functions.js   # Capa de vista — DOM, lightbox, galería
│   ├── css/
│   ├── pages/
│   │   ├── 01-gallery.html       # Load More
│   │   ├── 02-gallery.html       # Infinite Scroll
│   │   └── 03-gallery.html       # Números de página
│   └── main.js                   # Lógica de la página de inicio
├── index.html                    # Hub de navegación
├── .editorconfig
├── .prettierrc.json
├── package.json
├── vite.config.js                # Configuración multipágina de Vite
└── README.md
```

---

## 👤 Autor

**Romario Korzun** — Front-End Developer

- GitHub: [@mrkorzun](https://github.com/mrkorzun)
- Página personal: [mrkorzun.github.io](https://mrkorzun.github.io)

---

<sub>Originalmente creado como ejercicio práctico dentro del curso **GoIT JavaScript**, como extensión de proyectos
previos de búsqueda de imágenes para comparar lado a lado tres estrategias de paginación.</sub>
