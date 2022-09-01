export default function scrollStep(step) {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * step,
    behavior: 'smooth',
  });
}