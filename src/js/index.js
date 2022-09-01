import '../sass/main.scss';
import fetch from './fetch';
import renderImage from './renderimage';
import scrollStep from './scrollStep';
import { lightbox } from './lightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const searchForma = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const textEnd = document.querySelector('.end-collection-text');
const loadButton = document.querySelector('.load-more');


let searchQuery = '';
let currentPage = 1;
let currentHits = 0;

searchForma.addEventListener('submit', submitForma);

async function submitForma(event) {
  event.preventDefault();
  // querySearch = event.currentTarget.querySearch.value;
  searchQuery = event.currentTarget.searchQuery.value;
  currentPage = 1;

  if (searchQuery === '') {
    return;
  }

  const response = await fetch(searchQuery, currentPage);
  currentHits = response.hits.length;

  if (response.totalHits > 40) {
    loadButton.classList.remove('is-hidden');
    textEnd.classList.add('is-hidden');
  } else {
    loadButton.classList.add('is-hidden');
    textEnd.classList.remove('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      renderImage(response.hits, gallery);
      scrollStep(-2000);
      lightbox.refresh();
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      loadButton.classList.add('is-hidden');
      textEnd.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

loadButton.addEventListener('click', clickLoad);

async function clickLoad() {
  currentPage += 1;
  const response = await fetch(searchQuery, currentPage);
  renderImage(response.hits, gallery);
  lightbox.refresh();
  currentHits += response.hits.length;

  scrollStep(2);

  if (currentHits === response.totalHits) {
    loadButton.classList.add('is-hidden');
    textEnd.classList.remove('is-hidden');
  }
}