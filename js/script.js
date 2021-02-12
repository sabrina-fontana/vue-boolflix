var app = new Vue({
el: '#app',
data: {
  searchInput: '',
  arrayMovie: [],
  arrayTV: [],
  resultId: 0,
  movieGenres: [],
  TVGenres: [],
  movieActorsName: [],
  TVActorsName: [],
  movieGenreSelected: 0,
  TVGenreSelected: 0
},
mounted() {
  let that = this;
  axios
  .get('https://api.themoviedb.org/3/genre/movie/list?api_key=a2092b04d9693f9c0da61a113dc5f29a')
  .then(function(resp) {
    that.movieGenres = resp.data.genres;
  })
  axios
  .get('https://api.themoviedb.org/3/genre/tv/list?api_key=a2092b04d9693f9c0da61a113dc5f29a')
  .then(function(resp) {
    that.TVGenres = resp.data.genres;
  })
},
methods: {
  search: async function() {
    console.log(this.movieGenreSelected)
    if (this.searchInput === '' && this.movieGenreSelected === 0) {
      return this.arrayMovie = [];
    }
    if (this.searchInput === '' && this.TVGenreSelected === 0) {
      return this.arrayTV = [];
    }
    await this.searchMovie();
    await this.searchTV();
    if (this.movieGenreSelected !== 0) {
      return this.filterMovie()
    } else if (this.TVGenreSelected !== 0) {
      return this.filterTV()
    }
  },
  searchMovie: async function() {
    this.arrayMovie = [];
    let that = this;
    if (this.searchInput.length > 0) {
      return axios.get('https://api.themoviedb.org/3/search/movie?api_key=a2092b04d9693f9c0da61a113dc5f29a&page=' + 1 + '&query=' + this.searchInput)
      .then(function(resp) {
        that.arrayMovie = resp.data.results;
      })
    }
    return this.filterMovie()
  },
  searchTV: function() {
    this.arrayTV = [];
    let that = this;
    if (this.searchInput.length > 0) {
      return axios.get('https://api.themoviedb.org/3/search/tv?api_key=a2092b04d9693f9c0da61a113dc5f29a&page=' + 1 + '&query=' + this.searchInput)
      .then(function(resp) {
        that.arrayTV = resp.data.results;
      })
    }
    return this.filterTV();
  },
  resultImg: function(el) {
    if (el.poster_path === null) {
      return 'img/placeholder.png'
    }
    return 'http://image.tmdb.org/t/p/w780' + el.poster_path;
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
  getMovieActors: function() {
    let that = this;
    axios.get('https://api.themoviedb.org/3/movie/' + this.resultId + '/credits?api_key=a2092b04d9693f9c0da61a113dc5f29a')
    .then(function(resp) {
      let actors = resp.data.cast;
      let names = [];
      actors.forEach((element) => {
        names.push(element.name);
      })
      that.movieActorsName = names;
    })
  },
  getTVActors: function() {
    let that = this;
    axios.get('https://api.themoviedb.org/3/tv/' + this.resultId + '/credits?api_key=a2092b04d9693f9c0da61a113dc5f29a')
    .then(function(resp) {
      let actors = resp.data.cast;
      let names = [];
      actors.forEach((element) => {
        names.push(element.name);
      })
      that.TVActorsName = names;
    })
  },
  showActors: function(actorsArray) {
    // solo i primi 5 attori
    let actors = actorsArray.slice(0, 5);
    // ritorno una stringa
    return actors.toString().replace(/,/g, ', ')
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
  showInfo: function(className, index, el) {
    let info = document.getElementsByClassName(className)[index];
    info.classList.add('active');
    this.resultId = el.id;
    if (className.includes('movie')) {
      this.getMovieActors();
    } else if (className.includes('tv')) {
      this.getTVActors();
    }
  },
  hideInfo: function(className, index, el) {
    let info = document.getElementsByClassName(className)[index];
    info.classList.remove('active');
  },
  filterMovie: async function() {
    if (this.searchInput.length === 0) {
      this.arrayMovie = [];
      let that = this;
      console.log(this.movieGenreSelected)
      return axios.get('https://api.themoviedb.org/3/discover/movie?api_key=a2092b04d9693f9c0da61a113dc5f29a&with_genres=' + this.movieGenreSelected)
      .then(function(resp) {
        return that.arrayMovie = resp.data.results;
      })
    }
    await this.searchMovie();
    let filteredMovies = [];
      if (this.movieGenreSelected  === 0) {
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
  }
  }
});
Vue.config.devtools = true;
