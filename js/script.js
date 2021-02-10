var app = new Vue({
el: '#app',
data: {
  searchInput: '',
  arrayFilm: [],
  arrayTV: []
},
methods: {
  search: function() {
    let that = this;
    if (this.searchInput === '') {
      return [this.arrayFilm = [], this.arrayTV = []];
    }
    // chiamata per film
    axios.get('https://api.themoviedb.org/3/search/movie?api_key=a2092b04d9693f9c0da61a113dc5f29a&query=' + this.searchInput)
    .then(function(resp) {
      that.arrayFilm = resp.data.results;
    })
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
  showInfo: function(className, index) {
    let info = document.getElementsByClassName(className)[index];
    info.classList.add('active');
  },
  hideInfo: function(className, index) {
    let info = document.getElementsByClassName(className)[index];
    info.classList.remove('active');
  }
  }
});
Vue.config.devtools = true;
