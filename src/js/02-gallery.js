import iziToast from 'izitoast';
import { createGalleryCardTemplate } from './render-functions';
import { getPhotosByQuery, getRandomPhotos } from './unsplash-api';

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  galleryList: document.querySelector('.js-gallery'),
  preloader: document.querySelector('.js-loader'),
  galleryTargetElement: document.querySelector('.js-gallery-target-element'),
};

const initGalleryByRandomPhotos = async () => {
  try {
    refs.preloader.classList.add('is-active');

    const { data } = await getRandomPhotos();

    const galleryCardsTemplate = data.map(img => createGalleryCardTemplate(img)).join('');

    refs.galleryList.innerHTML = galleryCardsTemplate;
  } catch (err) {
    console.log(err);
  } finally {
    refs.preloader.classList.remove('is-active');
  }
};

// initGalleryByRandomPhotos();

const observerOptions = {
  root: null,
  rootMargin: '0px 0px 400px 0px',
  threshold: 0.1,
};

const loadMorePhotos = async entries => {
  if (entries[0].isIntersecting) {
    try {
      page++;

      const data = await getPhotosByQuery(userQuery, page);

      const galleryCardsTemplate = data.results.map(img => createGalleryCardTemplate(img)).join('');

      refs.galleryList.insertAdjacentHTML('beforeend', galleryCardsTemplate);

      if (data.total_pages === page) {
        observerInstance.unobserve(refs.galleryTargetElement);
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const observerInstance = new IntersectionObserver(loadMorePhotos, observerOptions);

let page = 1;
let userQuery = '';

// const onLoadMoreBtnClick = async event => {
//   try {
//     page++;

//     const data = await getPhotosByQuery(userQuery, page);

//     const galleryCardsTemplate = data.results.map(img => createGalleryCardTemplate(img)).join('');

//     refs.galleryList.insertAdjacentHTML('beforeend', galleryCardsTemplate);

//     if (data.total_pages === page) {
//       refs.loadMoreBtn.classList.add('is-hidden');
//       refs.loadMoreBtn.removeEventListener('click', onLoadMoreBtnClick);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

const onSearchFormSubmit = async event => {
  try {
    event.preventDefault();

    const { target: searchFormEl } = event;

    userQuery = searchFormEl.elements.user_query.value.trim();

    if (!userQuery) {
      iziToast.error({
        message: 'Поле для пошуку має бути заповненим!',
        position: 'topRight',
      });

      return;
    }

    refs.galleryList.innerHTML = '';

    refs.preloader.classList.add('is-active');

    page = 1;

    observerInstance.unobserve(refs.galleryTargetElement);

    const data = await getPhotosByQuery(userQuery, page);

    if (data.total === 0) {
      iziToast.error({
        message: 'Зображень не знайдено!',
        position: 'topRight',
      });

      return;
    }

    if (data.total_pages > 1) {
      observerInstance.observe(refs.galleryTargetElement);
    }

    const galleryCardsTemplate = data.results.map(img => createGalleryCardTemplate(img)).join('');

    refs.galleryList.innerHTML = galleryCardsTemplate;
  } catch (err) {
    console.log(err);
  } finally {
    refs.preloader.classList.remove('is-active');
  }
};

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
