import Notiflix from 'notiflix';
import { refs } from './refs';
import { PixabeyApi } from './pixabeyapi';
import { renderGallery } from './render-gallery';

const pixabeyApi = new PixabeyApi();

const onSearchFormSubmit = async event => {
  event.preventDefault();

  pixabeyApi.query = event.target.elements.searchQuery.value;
  pixabeyApi.page = 1;

  try {
    const data = await pixabeyApi.fetchGallery();
    console.log(data.hits);

    if (!data.hits.length) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again'
      );
      event.target.reset();
      refs.galleryContainer.innerHTML = '';

      refs.loadMoreBtn.classList.add('is-hidden');
      return;
    }
    if (pixabeyApi.page * 40 > data.totalHits) {
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
      refs.loadMoreBtn.classList.add('is-hidden');
      refs.galleryContainer.innerHTML = renderGallery(data.hits);
      return;
    }
    refs.galleryContainer.innerHTML = renderGallery(data.hits);
    refs.loadMoreBtn.classList.remove('is-hidden');
  } catch (err) {
    console.log(err);
  }
};
const onLoadMoreBtnClick = async event => {
  pixabeyApi.page += 1;
  pixabeyApi.fetchGallery();

  // event.target.classList.add('disabled');
  try {
    const data = await pixabeyApi.fetchGallery();

    refs.galleryContainer.insertAdjacentHTML(
      'beforeend',
      renderGallery(data.hits)
    );
  } catch (err) {
    console.log(err);
  }
};

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
