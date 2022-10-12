searchFormBtn.addEventListener('click', () => {
  const query = searchBox.value;
  headerCategoryTitle.innerText = 'Resultados de la Busqueda';
  location.hash = `#search=${query}`;
  getSearch(query);
});
trendingBtn.addEventListener('click', () => {
  location.hash = "#trends";
  headerCategoryTitle.innerText = 'Tendencias';
  getTrendingMovies();
});
arrowBtn.addEventListener('click', () => {
  history.back()
});

let moviePosterUrl = undefined;

window.addEventListener('load', navi, false);
window.addEventListener('hashchange', navi, false);

function navi() {
  window.removeEventListener('scroll', isBottom);
  infiniteScroll = undefined
  params = undefined
  page = 1;

  if (location.hash.startsWith('#trends')) {
    trendsPage();
  } else if (location.hash.startsWith('#search=')) {
    searchPage();
  } else if (location.hash.startsWith('#movie=')) {
    movieDetailsPage();
  } else if (location.hash.startsWith('#category=')) {
    categoriesPage();
  } else {
    homePage();
  }
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

}

function homePage () {
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.add('inactive');
  arrowBtn.classList.remove('header-arrow---white');
  headerTitle.classList.remove('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.remove('inactive');
  categoriesPreviewSection.classList.remove('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.add('inactive');
  likedSection.classList.remove('inactive');

  getTrendingMoviesPreview()
  getGenresCategories()
  getLikedMovies()
}
function categoriesPage () {
  window.addEventListener('scroll', isBottom);

  if (!categoriesPreviewList.lastElementChild) {
    location.hash = '#home'
    return
  }

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');
  likedSection.classList.add('inactive');
}
function movieDetailsPage () {
  if (!moviePosterUrl) {
    location.hash = '#home'
    return
  }

  headerSection.classList.add('header-container--long');
  headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${moviePosterUrl})`;
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.add('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.remove('inactive');
  likedSection.classList.add('inactive');
}
function searchPage () {
  window.addEventListener('scroll', isBottom);

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');
  likedSection.classList.add('inactive');

  if (!categoriesPreviewList.lastElementChild) {
    location.hash = '#home'
    return
  }
}
function trendsPage () {
  window.addEventListener('scroll', isBottom);

  if (!categoriesPreviewList.lastElementChild) {
    location.hash = '#home'
    return
  }

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');
  likedSection.classList.add('inactive');
}