var app = new Vue({
el: '#app',
data: {
  apiKey: 'a2092b04d9693f9c0da61a113dc5f29a',
  searchInput: '',
  movieTitle: 'I film più visti',
  TVTitle: 'Le serie TV più viste',
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
  // film più popolari
  axios.all([
    axios.get('https://api.themoviedb.org/3/movie/popular', {
      params: {
        api_key: this.apiKey
       }
    }),
    // serie TV più popolari
    axios.get('https://api.themoviedb.org/3/tv/popular', {
      params: {
        api_key: this.apiKey
       }
    }),
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
    that.arrayMovie = resp[0].data.results;
    that.arrayTV = resp[1].data.results;
    that.movieGenres = resp[2].data.genres;
    that.TVGenres = resp[3].data.genres;
  }));
},
methods: {
  showSearch: function() {
    let input = document.getElementsByTagName('input')[0];
    input.classList.toggle('active');
  },
  // DIVERSI CASI:
  // 1 - input di ricerca vuoto E nessun genere selezionato
  // 2 - input popolato E nessun genere selezionato
  // 3 - input vuoto E un genere selezionato
  // 4 - input popolato E un genere selezionato
  search: async function() {
    // !!!search non rileva i generi perché sono legati all'evento onchange della select ---> quando la select cambia ricontrollo se l'input è popolato o meno
    // CASO 1 - ritorna l'array vuoto
    if (this.searchInput === '' && this.movieGenreSelected === 0) {
      this.arrayMovie = [];
    }
    if (this.searchInput === '' && this.TVGenreSelected === 0) {
      this.arrayTV = [];
    }
    // CASO 2 - rifai la chiamata all'API
    else {
      await this.searchMovie();
      await this.searchTV();

      if (this.movieGenreSelected !== 0) {
        this.filterMovie()
      }
      if (this.TVGenreSelected !== 0) {
        this.filterTV()
      }
    }
  },
  searchMovie: function() {
    this.arrayMovie = [];
    let that = this;
    if (this.searchInput.length > 0) {
      return axios
      .get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: this.apiKey,
          query: this.searchInput
        }
      })
      .then(function(resp) {
        that.movieTitle = 'Film'
        return that.arrayMovie = resp.data.results;
      })
    }
  },
  searchTV: function() {
    this.arrayTV = [];
    let that = this;
    if (this.searchInput.length > 0) {
      return axios
      .get('https://api.themoviedb.org/3/search/tv', {
        params: {
          api_key: this.apiKey,
          query: this.searchInput
        }
      })
      .then(function(resp) {
        return that.arrayTV = resp.data.results;
      })
    }
  },
  filterMovie: async function() {
     // CASO 3 - ritorna i risultati più famosi per il genere selezionato
     if (this.searchInput.length === 0) {
       this.arrayMovie = [];
       let that = this;
       return axios.get('https://api.themoviedb.org/3/discover/movie?api_key=a2092b04d9693f9c0da61a113dc5f29a&with_genres=' + this.movieGenreSelected)
       .then(function(resp) {
         return that.arrayMovie = resp.data.results;
       })
     }
     // CASO 4 - rifai la chiamata all'API e filtra i risultati per genere
     await this.searchMovie();
     let filteredMovies = [];
       if (this.movieGenreSelected === 0) {
         return this.arrayMovie
       } else {
         filteredMovies = this.arrayMovie.filter((element) => {
           if (element.genre_ids.includes(this.movieGenreSelected)) {
             return element;
           }
         })
         return this.arrayMovie = filteredMovies
       }
   },
  filterTV: async function() {
   if (this.searchInput.length === 0) {
     this.arrayTV = [];
     let that = this;
     return axios.get('https://api.themoviedb.org/3/discover/tv?api_key=a2092b04d9693f9c0da61a113dc5f29a&with_genres=' + this.TVGenreSelected)
     .then(function(resp) {
       return that.arrayTV = resp.data.results;
     })
   }
   await this.searchTV();
   let filteredTV = [];
     if (this.TVGenreSelected === 0) {
       return this.arrayTV
     } else {
       filteredTV = this.arrayTV.filter((element) => {
         if (element.genre_ids.includes(this.TVGenreSelected)) {
           return element;
         }
       })
       return this.arrayTV = filteredTV
     }
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
