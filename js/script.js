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
  TVActorsName: []
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
  search: function() {
    if (this.searchInput === '') {
      return [this.arrayMovie = [], this.arrayTV = []];
    }
    this.searchMovie();
    this.searchTV();
  },
  searchMovie: function() {
    this.arrayMovie = [];
    let that = this;
    // chiamata per film (5 pagine)
    for (var x = 1; x <= 5; x++) {
      axios.get('https://api.themoviedb.org/3/search/movie?api_key=a2092b04d9693f9c0da61a113dc5f29a&page=' + x + '&query=' + this.searchInput)
      .then(function(resp) {
        that.arrayMovie = [...that.arrayMovie, ...resp.data.results];
      })
    }
  },
  searchTV: function() {
    this.arrayTV = [];
    let that = this;
    // chiamata per serie tv (5 pagine)
    for (var x = 1; x <= 5; x++) {
      axios.get('https://api.themoviedb.org/3/search/tv?api_key=a2092b04d9693f9c0da61a113dc5f29a&page=' + x + '&query=' + this.searchInput)
      .then(function(resp) {
        that.arrayTV = [...that.arrayTV, ...resp.data.results];
      })
    }
  },
  resultImg: function(el) {
    if (el.poster_path === null) {
      return 'placeholder.png'
    }
    return 'http://image.tmdb.org/t/p/w780' + el.poster_path;
  },
  resultRating: function(el) {
    // arrotondo i voti su base 5
    return Math.round(el.vote_average / 2);
  },
  getFlag: function(el) {
    let language = el.original_language;
    if (language === 'en') {
      language = 'gb'
    }
    if (language === 'da') {
      language = 'dk'
    }
    if (language === 'el') {
      language = 'gr'
    }
    if (language === 'ja') {
      language = 'jp'
    }
    if (language === 'cs') {
      language = 'cz'
    }
    if (language === 'ur') {
      language = 'pk'
    }
    if (language === 'zh') {
      language = 'cn'
    }
    if (language === 'ko') {
      language = 'kr'
    }
    if (language === 'xx') {
      return '';
    }
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
      console.log('ciao')
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
  }
  }
});
Vue.config.devtools = true;
