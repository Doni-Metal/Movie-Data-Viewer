// Utils

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
    
    movieImg.setAttribute('src', `${POSTERS}${movie.poster_path}`)
    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
    movieContainer.addEventListener('click', () => {
      moviePosterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      getMovieDetails(movie.id);
      location.hash = `#movie=${movie.id}-${movie.title}`
    })
  });
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

// Api Requests

async function fetchData(endpoint, queryParm = '?') {
  const API = 'https://api.themoviedb.org/3';
  try {
    const response = await fetch(`${API}${endpoint}${queryParm}${API_KEY}`);
    const data = await response.json();
    return data
  } catch (error) {
    return console.error(new Error(error));
  }
}


const getTrendingMoviesPreview = async (container = trendingMoviesPreviewList) => {
  eraseNodes(container);

  const endpoint = '/trending/movie/day';
  const data = await fetchData(endpoint);
  const movies = data.results;

  renderMovies(movies, container)
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
  const queryParm = `?with_genres=${id}`
  const data = await fetchData(endpoint, queryParm); 
  const movies = data.results;

  renderMovies(movies, genericListContainer)
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
}

const getMovieRecommendations = async (movie_id) => {
  eraseNodes(relatedMoviesContainer);

  const endpoint = `/movie/${movie_id}/recommendations`;
  const data = await fetchData(endpoint);
  const movies = data.results;

  renderMovies(movies, relatedMoviesContainer)
}