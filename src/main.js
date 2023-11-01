import Vue from 'vue'
import PokedexApp from './PokedexApp.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(PokedexApp),
}).$mount('#pokedex')
