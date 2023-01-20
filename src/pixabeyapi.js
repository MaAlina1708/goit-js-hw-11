'use strict';

import axios from 'axios';

const API_KEY = '32893682-1f502f368ea6a12b1f7b8e8e1';
const BASE_URL = 'https://pixabay.com/api';

export class PixabeyApi {
  constructor() {
    this.query = null;
    this.page = 1;
  }
  async fetchGallery() {
    const response = await axios.get(
      `${BASE_URL}/?page=${this.page}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&key=${API_KEY}&per_page=40`
    );
    return response.data;
  }
  catch(err) {
    console.log(err);
  }
}
