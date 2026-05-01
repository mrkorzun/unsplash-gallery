import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.min.css';
import iziToast from 'izitoast';
import { createGalleryCardTemplate } from './render-functions';
import { getPhotosByQuery, getRandomPhotos } from './unsplash-api';

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  galleryList: document.querySelector('.js-gallery'),
  preloader: document.querySelector('.js-loader'),
  paginationContainer: document.querySelector('#tui-pagination-container'),
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

let userQuery = '';

const paginationOptions = {
  itemsPerPage: 12,
  visiblePages: 5,
  page: 1,
};

const paginationInstance = new Pagination(refs.paginationContainer, paginationOptions);

paginationInstance.on('afterMove', async ({ page: currentPage }) => {
  try {
    const data = await getPhotosByQuery(userQuery, currentPage);

    const galleryCardsTemplate = data.results.map(img => createGalleryCardTemplate(img)).join('');

    refs.galleryList.innerHTML = galleryCardsTemplate;
  } catch (err) {
    console.log(err);
  }
});

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

    paginationInstance.reset(0);
    refs.paginationContainer.classList.remove('is-active');

    const data = await getPhotosByQuery(userQuery, 1);

    if (data.total === 0) {
      iziToast.error({
        message: 'Зображень не знайдено!',
        position: 'topRight',
      });

      return;
    }

    if (data.total_pages > 1) {
      paginationInstance.reset(data.total);
      refs.paginationContainer.classList.add('is-active');
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
