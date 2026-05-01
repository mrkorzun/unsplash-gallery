export const createGalleryCardTemplate = ({ alt_description: alt, urls: { regular: url } }) => {
  return `
  <li class="gallery-card">
    <img class="gallery-img" src="${url}" alt="${alt}" />
  </li>
  `;
};

export const createPostCardTemplate = ({ id, title, body }) => {
  return `
  <li class="posts-item">
    <h2 class="posts-title">${title}</h2>
    <p class="posts-text">${body}</p>
    <p class="posts-id">id: ${id}</p>
  </li>
  `;
};
