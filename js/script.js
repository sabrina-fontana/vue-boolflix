var app = new Vue({
el: '#app',
data: {
  searchInput: '',
  arrayFilm: []
},
methods: {
  searchFilm: function() {
    let that = this;
    if (this.searchInput === '') {
      return this.arrayFilm = [];
    }
    axios.get('https://api.themoviedb.org/3/search/movie?api_key=a2092b04d9693f9c0da61a113dc5f29a&query=' + this.searchInput)
    .then(function(resp) {
      that.arrayFilm = resp.data.results;
      })
  },
  filmImg: function(film) {
    if (film.poster_path === null) {
      return 'placeholder.png'
    }
    return 'http://image.tmdb.org/t/p/w780' + film.poster_path;
  },
  filmRating: function(film) {
    // arrotondo i voti su base 5
    return Math.round(film.vote_average / 2);
  },
  getFlag: function(film) {
    let language = film.original_language;
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
    if (language === 'xx') {
      return 'unknown'
    }
    console.log(language)
    return 'https://www.countryflags.io/' + language + '/flat/24.png';
  }
}
});
Vue.config.devtools = true;
