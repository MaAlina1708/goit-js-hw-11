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
    console.log(data);
    if (!data.hits.length) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again'
      );
      refs.galleryContainer.innerHTML = '';
      event.target.reset();
      return;
    }
    if (pixabeyApi.page * 40 > data.totalHits) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
      refs.galleryContainer.innerHTML = renderGallery(data.hits);
      return;
    }
    refs.galleryContainer.innerHTML = renderGallery(data.hits);
    refs.loadMoreBtn.classList.remove('is-hidden');
  } catch (err) {
    console.log(err);
  }
};
refs.searchForm.addEventListener('submit', onSearchFormSubmit);
