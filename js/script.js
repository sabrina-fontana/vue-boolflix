var app = new Vue({
el: '#app',
data: {
  searchInput: '',
  arrayFilm: [],
  arrayTV: [],
  resultId: 0,
  filmActorsName: [],
  TVActorsName: []
},
methods: {
  search: function() {
    if (this.searchInput === '') {
      return [this.arrayFilm = [], this.arrayTV = []];
    }
    this.searchFilm();
    this.searchTV();
  },
  searchFilm: function() {
    let that = this;
    // chiamata per film
    axios.get('https://api.themoviedb.org/3/search/movie?api_key=a2092b04d9693f9c0da61a113dc5f29a&query=' + this.searchInput)
    .then(function(resp) {
      that.arrayFilm = resp.data.results;
    })
  },
  searchTV: function() {
    let that = this;
    // chiamata per serie tv
    axios.get('https://api.themoviedb.org/3/search/tv?api_key=a2092b04d9693f9c0da61a113dc5f29a&query=' + this.searchInput)
    .then(function(resp) {
      that.arrayTV = resp.data.results;
    })
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
  getFilmActors: function() {
    let that = this;
    axios.get('https://api.themoviedb.org/3/movie/' + this.resultId + '/credits?api_key=a2092b04d9693f9c0da61a113dc5f29a')
    .then(function(resp) {
      let actors = resp.data.cast;
      let names = [];
      actors.forEach((element) => {
        names.push(element.name);
      })
      that.filmActorsName = names;
      console.log(that.filmActorsName.toString().replace(',', ', '))
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
  showFilmActors: function() {
    // solo i primi 5 attori
    let actors = this.filmActorsName.slice(0, 5);
    // ritorno una stringa
    return actors.toString().replace(/,/g, ', ')
  },
  showTVActors: function() {
    // solo i primi 5 attori
    let actors = this.TVActorsName.slice(0, 5);
    // ritorno una stringa
    return actors.toString().replace(/,/g, ', ')
  },
  showInfo: function(className, index, el) {
    let info = document.getElementsByClassName(className)[index];
    info.classList.add('active');
    this.resultId = el.id;
    console.log(this.resultId)
    if (className.includes('film')) {
      this.getFilmActors();
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
