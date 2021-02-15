var app = new Vue({
el: '#app',
data: {
  apiKey: 'a2092b04d9693f9c0da61a113dc5f29a',
  searchInput: '',
  movieTitle: '',
  TVTitle: '',
  arrayMovie: [],
  arrayTV: [],
  resultId: 0,
  movieGenres: [],
  TVGenres: [],
  movieActors: [],
  TVActors: [],
  movieGenreSelected: 0,
  TVGenreSelected: 0
},
mounted() {
  let that = this;
  axios.all([
    // generi film
    axios.get('https://api.themoviedb.org/3/genre/movie/list', {
      params: {
        api_key: this.apiKey
      }
    }),
    // generi serie TV
    axios.get('https://api.themoviedb.org/3/genre/tv/list', {
      params: {
        api_key: this.apiKey
      }
    })
  ]).then(axios.spread((...resp) => {
    that.movieGenres = resp[0].data.genres;
    that.TVGenres = resp[1].data.genres;
  }));
  this.popularMovies();
  this.popularTV();
},
methods: {
  showSearch: function() {
    let input = document.getElementsByTagName('input')[0];
    input.classList.toggle('active');
  },
  popularMovies: function() {
    this.movieTitle = 'I film più visti';
    let that = this;
    axios.get('https://api.themoviedb.org/3/movie/popular', {
        params: {
          api_key: this.apiKey
         }
      })
    .then(function(resp) {
      that.arrayMovie = resp.data.results;
    });
  },
  popularTV: function() {
    this.TVTitle = 'Le serie TV più viste';
    let that = this;
    axios.get('https://api.themoviedb.org/3/tv/popular', {
      params: {
        api_key: this.apiKey
       }
    })
    .then(function(resp) {
      that.arrayTV = resp.data.results;
    });
  },
  search: async function() {
    if (this.searchInput === '' && this.movieGenreSelected === 0 && this.TVGenreSelected === 0) {
      await this.popularMovies();
      await this.popularTV();
    }
    if (this.searchInput !== '') {
      await this.searchMovie();
      await this.searchTV();
    } else {
      // se l'input è vuoto...
      this.movieTitle = 'Film';
      this.TVTitle = 'Serie TV';
      if (this.movieGenreSelected !== 0) {
        let that = this;
        return axios.get('https://api.themoviedb.org/3/discover/movie?api_key=a2092b04d9693f9c0da61a113dc5f29a&with_genres=' + this.movieGenreSelected)
        .then(function(resp) {
          return that.arrayMovie = resp.data.results;
        })
      }
      return this.popularMovies()
    }
  },
  searchMovie: async function() {
    let that = this;
    await axios
    .get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: this.apiKey,
        query: this.searchInput
      }
    })
    .then(function(resp) {
      that.movieTitle = `FILM risultati per: ${that.searchInput}`;
      return that.arrayMovie = resp.data.results;
    })
    if (this.movieGenreSelected !== 0) {
      this.filterMovie();
    }
  },
  searchTV: async function() {
    let that = this;
    await axios
    .get('https://api.themoviedb.org/3/search/tv', {
      params: {
        api_key: this.apiKey,
        query: this.searchInput
      }
    })
    .then(function(resp) {
      that.TVTitle = `SERIE TV risultati per: ${that.searchInput}`;
      return that.arrayTV = resp.data.results;
    })
    if (this.TVGenreSelected !== 0) {
      this.filterTV();
    }
  },
  filterMovie: async function() {
     let filteredMovies = this.arrayMovie.filter((element) => {
       if (element.genre_ids.includes(this.movieGenreSelected)) {
         return element;
       }
     })
     return this.arrayMovie = filteredMovies;
   },
  filterTV: async function() {
    let filteredTV = this.arrayTV.filter((element) => {
      if (element.genre_ids.includes(this.TVGenreSelected)) {
        return element;
      }
    })
    return this.arrayTV = filteredTV;
 },
  noResults: function(array, typeGenre) {
    return array.length === 0 && typeGenre !== 0;
  },
  resultImg: function(el) {
    if (el.poster_path === null) {
      return 'img/placeholder.png'
    }
    return 'http://image.tmdb.org/t/p/w780' + el.poster_path;
  },
  noImg: function(el) {
    return el.poster_path === null;
  },
  resultRating: function(el) {
    // arrotondo i voti su base 5
    return Math.round(el.vote_average / 2);
  },
  getFlag: function(el) {
    let language = el.original_language;
    if (language === 'en') language = 'gb';
    if (language === 'da') language = 'dk';
    if (language === 'el') language = 'gr';
    if (language === 'ja') language = 'jp';
    if (language === 'cs') language = 'cz';
    if (language === 'ur') language = 'pk';
    if (language === 'zh') language = 'cn';
    if (language === 'ko') language = 'kr';
    if (language === 'xx') return '';
    return 'https://www.countryflags.io/' + language + '/flat/24.png';
  },
  getMovieActors: function(id) {
    let that = this;
    return axios
    .get('https://api.themoviedb.org/3/movie/' + id + '/credits', {
      params: {
        api_key: this.apiKey
      }
    })
    .then(function(resp) {
      let actors = resp.data.cast;
      let actorsNames = [];
      actors.forEach((element) => {
        actorsNames.push(element.name);
      })
      return that.movieActors = actorsNames;
    })
  },
  getTVActors: function(id) {
    let that = this;
    return axios
    .get('https://api.themoviedb.org/3/tv/' + id + '/credits', {
      params: {
        api_key: this.apiKey
      }
    })
    .then(function(resp) {
      let actors = resp.data.cast;
      let actorsNames = [];
      actors.forEach((element) => {
        actorsNames.push(element.name);
      })
      return that.TVActors = actorsNames;
    })
  },
  showActors: function(actorsArray) {
    return actorsArray.slice(0, 5).toString().replace(/,/g, ', ')
  },
  getGenre: function(el, genreArray) {
    let elGenres = [];
    // ciclo tra tutti i generi del film/serie tv
    for (let x = 0; x < el.genre_ids.length; x++) {
      // ciclo nell'array dei generi possibili e confronto gli id
      genreArray.forEach((genre) => {
        if (el.genre_ids[x] === genre.id) {
          elGenres.push(genre.name);
        }
      })
    }
    return elGenres.toString().replace(/,/g, ', ')
  },
  showInfo: async function(className, index, el) {
    let info = document.getElementsByClassName(className)[index];
    info.classList.add('active');
  },
  hideInfo: function(className, index, el) {
    let info = document.getElementsByClassName(className)[index];
    info.classList.remove('active');
  }
  }
});
Vue.config.devtools = true;
