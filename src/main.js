// Utils
let page = 1;
let throttleTimer;
let infiniteScroll;
let params;
 
const throttle = (callback, time) => {
  if (throttleTimer) return;
 
  throttleTimer = true;
 
  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time);
};

const loadImages = (images, observer) => {
  images.forEach(img => {
    if (img.isIntersecting) {
      img.target.src = img.target.dataset.src;
      observer.unobserve(img.target)
    }
  })
}

function eraseNodes(container) {
  let child = container.lastElementChild;
  while (child) {
    container.removeChild(child)
    child = container.lastElementChild;
  }
}

const renderMovies = (movies, container) => {
  const POSTERS = 'https://image.tmdb.org/t/p/w300/';
  
  movies.forEach(movie => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    
    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);

    const likeBtn = document.createElement('button');
    likeBtn.classList.add('like-btn');
    if (likedMovieList()[movie.id]) {
      likeBtn.classList.add('like-btn--liked');
    } 
    likeBtn.addEventListener('click', () => {
      likeBtn.classList.toggle('like-btn--liked');
      likeMovie(movie);
      getLikedMovies()
    });
    
    movieImg.setAttribute('src', 'https://placeholder.pics/svg/300x450');
    movieImg.setAttribute('data-src', `${POSTERS}${movie.poster_path}`)
    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(likeBtn);
    container.appendChild(movieContainer);
    movieImg.addEventListener('click', () => {
      moviePosterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      getMovieDetails(movie.id);
      location.hash = `#movie=${movie.id}-${movie.title}`
    })
    movieImg.addEventListener('error', () => {
      movieImg.setAttribute('src', 'https://placeholder.pics/svg/300x450')
    })
  });
  let observer = undefined
  if (container == genericListContainer) {
    observer = new IntersectionObserver(loadImages)
  } else {
    observer = new IntersectionObserver(loadImages, {
      root: container,
      rootMargin: '0px 200px 200px 0px'
    })
  }
  document.querySelectorAll('img').forEach(img => observer.observe(img));
}

const displayCategories = (categories, container) => {
  categories.forEach(category => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');

    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', `id${category.id}`);
    categoryTitle.innerText = category.name

    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
    categoryTitle.addEventListener('click', () => {
      getCategoryList(category.id, category.name),
      location.hash = `#category=${category.id}-${category.name}`
    })
  })  
}

const isBottom = () => {
  throttle(() => {
    const endOfPage = (window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 15);
  
    if(endOfPage) {
      loadMore()
    }
  }, 1000)
} 

const loadMore = async () => {
  let param;
  if (params) {
    param = `${params}&page=${page}`;
  } else {
    param = `?page=${page}`;
  }

  const newPage = await fetchData(infiniteScroll, param);
  const maxPage = newPage.total_pages;
  if(page < maxPage){
    renderMovies(newPage.results, genericListContainer);
    page++ 
  }  
}

function likedMovieList() {
  const item = JSON.parse(localStorage.getItem('liked_movies'));
  let movies;

  if (item) {
    movies = item;
  } else {
    movies = {};
  }

  return movies;
}

function likeMovie(movie) {
  const likedMovies = likedMovieList();
  
  if (likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined;
  } else {
    likedMovies[movie.id] = movie;
  }

  localStorage.setItem('liked_movies' ,JSON.stringify(likedMovies))
}
  

// Api Requests
async function fetchData(endpoint, queryParm = '?') {
  const API = 'https://api.themoviedb.org/3';
  try {
    const response = await fetch(`${API}${endpoint}${queryParm}${API_KEY}`);
    const data = await response.json();
    if (response.ok) {
      return data
    }
    throw data.status_message
  } catch (error) {
    return console.error(error);
  }
}

function getLikedMovies() {
  eraseNodes(likedMoviesContainer);

  const likedMovies = likedMovieList();
  const moviesArr = Object.values(likedMovies);

  renderMovies(moviesArr, likedMoviesContainer)
}

const getTrendingMovies = async () => {
  eraseNodes(genericListContainer);

  const endpoint = '/trending/movie/day';
  const data = await fetchData(endpoint);
  const movies = data.results;

  renderMovies(movies, genericListContainer);
  page++;
  infiniteScroll = endpoint 
}

const getTrendingMoviesPreview = async () => {
  eraseNodes(trendingMoviesPreviewList);

  const endpoint = '/trending/movie/day';
  const data = await fetchData(endpoint);
  const movies = data.results;

  renderMovies(movies, trendingMoviesPreviewList);
}

const getGenresCategories = async () => {
  const endpoint = '/genre/movie/list';
  const data = await fetchData(endpoint);
  
  const genres = data.genres;
  eraseNodes(categoriesPreviewList);
  displayCategories(genres, categoriesPreviewList)
}

const getCategoryList = async (id, catName) => {
  eraseNodes(genericListContainer);
  headerCategoryTitle.innerText = catName

  const endpoint = `/discover/movie`;
  const queryParm = `?with_genres=${id}`;
  const data = await fetchData(endpoint, queryParm); 
  const movies = data.results;

  renderMovies(movies, genericListContainer);
  page++;
  infiniteScroll = endpoint;
  params = queryParm;
}

const getMovieDetails = async (id) => {
  const endpoint = `/movie/${id}`;
  const data = await fetchData(endpoint);
  const movie = data;

  
  movieDetailTitle.innerText = movie.title;
  movieDetailScore.innerText = movie.vote_average;
  movieDetailDescription.innerText = movie.overview;

  eraseNodes(movieDetailCategoriesList);
  displayCategories(movie.genres, movieDetailCategoriesList);
  getMovieRecommendations(id);
}

const getSearch = async (query) => {
  eraseNodes(genericListContainer);
  const endpoint = `/search/movie`;
  const queryParm = `?query=${query}`;
  const data = await fetchData(endpoint, queryParm);
  const results = data.results;
  
  renderMovies(results, genericListContainer);
  page++;
  infiniteScroll = endpoint;
  params = queryParm;
}

const getMovieRecommendations = async (movie_id) => {
  eraseNodes(relatedMoviesContainer);

  const endpoint = `/movie/${movie_id}/recommendations`;
  const data = await fetchData(endpoint);
  const movies = data.results;

  renderMovies(movies, relatedMoviesContainer)
}
