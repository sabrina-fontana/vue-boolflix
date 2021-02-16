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
  onlyMovie: function() {
    document.getElementsByClassName('movie-container')[0].style.display = 'block';
    document.getElementsByClassName('tv-container')[0].style.display = 'none';
  },
  onlyTV: function() {
    document.getElementsByClassName('movie-container')[0].style.display = 'none';
    document.getElementsByClassName('tv-container')[0].style.display = 'block';
  },
  allResults: function() {
    document.getElementsByClassName('movie-container')[0].style.display = 'block';
    document.getElementsByClassName('tv-container')[0].style.display = 'block';
  },
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
    })
    .catch(error => {
    alert('Ops. Qualcosa è andato storto. Riprova più tardi')
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
  checkMovie: function() {
    let that = this;
    // CASO 1 - input vuoto e genere vuoto -> ritorno i più popolari
    if (this.searchInput.length === 0 && this.movieGenreSelected === 0) {
      return this.popularMovies();
    }
    // CASO 2 - input vuoto e genere selezionato -> ritorno discover genres
    if (this.searchInput.length === 0 && this.movieGenreSelected !== 0) {
      that.movieTitle = `FILM più popolari per il genere: `;
      return axios
      .get('https://api.themoviedb.org/3/discover/movie?api_key=' + this.apiKey + '&with_genres=' + this.movieGenreSelected)
      .then(function(resp) {
        return that.arrayMovie = resp.data.results;
      })
    }
    // CASO 3 - input popolato e genere selezionato -> filtro per titolo e poi per genere
    if (this.searchInput.length !== 0 && this.movieGenreSelected !== 0) {
      return axios
      .get('https://api.themoviedb.org/3/search/movie', {
          params: {
            api_key: this.apiKey,
            query: this.searchInput
           }
        })
      .then(function(resp) {
        that.movieTitle = `FILM risultati per: ${that.searchInput}`;
        let filteredMovies = resp.data.results.filter((element) => {
          if (element.genre_ids.includes(that.movieGenreSelected)) {
            return element;
          }
        })
        return that.arrayMovie = filteredMovies;
      })
    }
    // CASO 4 - input popolato e genere vuoto -> filtro per titolo
    if (this.searchInput.length !== 0 && this.movieGenreSelected === 0) {
      return axios
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
    }
  },
  checkTV: function() {
    let that = this;
    // CASO 1 - input vuoto e genere vuoto -> ritorno i più popolari
    if (this.searchInput.length === 0 && this.TVGenreSelected === 0) {
      return this.popularTV();
    }
    // CASO 2 - input vuoto e genere selezionato -> ritorno discover genres
    if (this.searchInput.length === 0 && this.TVGenreSelected !== 0) {
      that.TVTitle = `SERIE TV più popolari per il genere: `;
      return axios
      .get('https://api.themoviedb.org/3/discover/tv?api_key=' + this.apiKey + '&with_genres=' + this.TVGenreSelected)
      .then(function(resp) {
        return that.arrayTV = resp.data.results;
      })
    }
    // CASO 3 - input popolato e genere selezionato -> filtro per titolo e poi per genere
    if (this.searchInput.length !== 0 && this.TVGenreSelected !== 0) {
      return axios
      .get('https://api.themoviedb.org/3/search/tv', {
        params: {
          api_key: this.apiKey,
          query: this.searchInput
         }
      })
      .then(function(resp) {
        that.TVTitle = `SERIE TV risultati per: ${that.searchInput}`;
        let filteredTV = resp.data.results.filter((element) => {
          if (element.genre_ids.includes(that.TVGenreSelected)) {
            return element;
          }
        })
        return that.arrayTV = filteredTV;
      })
    }
    // CASO 4 - input popolato e genere vuoto -> filtro per titolo
    if (this.searchInput.length !== 0 && this.TVGenreSelected === 0) {
      return axios
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
    }
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
