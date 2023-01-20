import Notiflix from 'notiflix';
import { refs } from './refs';
import { PixabeyApi } from './pixabeyapi';
import { renderGallery } from './render-gallery';

const pixabeyApi = new PixabeyApi();

const onSearchFormSubmit = async event => {
  event.preventDefault();

  pixabeyApi.query = event.target.elements.searchQuery.value.trim();
  pixabeyApi.page = 1;

  try {
    const data = await pixabeyApi.fetchGallery();

    if (!data.hits.length) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again'
      );
      event.target.reset();
      refs.galleryContainer.innerHTML = '';
      loadBtnHide();
      return;
    }
    if (pixabeyApi.page * 40 >= data.totalHits) {
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
      event.target.reset();
      loadBtnHide();
      refs.galleryContainer.innerHTML = renderGallery(data.hits);
      return;
    }
    refs.galleryContainer.innerHTML = renderGallery(data.hits);
    loadBtnShow();
    event.target.reset();
  } catch (err) {
    console.log(err);
  }
};
const onLoadMoreBtnClick = async event => {
  pixabeyApi.page += 1;

  try {
    const data = await pixabeyApi.fetchGallery();

    refs.galleryContainer.insertAdjacentHTML(
      'beforeend',
      renderGallery(data.hits)
    );
    if (pixabeyApi.page * 40 >= data.totalHits) {
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
      loadBtnHide();
      refs.galleryContainer.insertAdjacentHTML = renderGallery(data.hits);
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

function loadBtnHide() {
  refs.loadMoreBtn.classList.add('is-hidden');
}
function loadBtnShow() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
