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
  }
}
});
Vue.config.devtools = true;
