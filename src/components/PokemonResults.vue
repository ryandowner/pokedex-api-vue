<template>
    <div class="results-body">
        <div class="results-header">
            All The Pokemon!
            <fieldset>
                <FormRadio
                    name="sorting"
                    id="sortName"
                    :classList="[ 'sort-radio', 'class-2' ]"
                    :checked="this.sort === 'name'"
                    label="Sort Name"
                    @change="sort = 'name'"
                />
                <FormRadio
                    name="sorting"
                    id="sortID"
                    :classList="[ 'sort-radio', 'class-2' ]"
                    :checked="this.sort === 'id'"
                    @change="sort = 'id'"
                    label="Sort ID"
                />
            </fieldset>
        </div>
        <div :class="resultsClasses">
            <template v-if="this.loading">
                <svg class="results-loading" viewBox="0 0 576 512">
                    <path d="M256 32C256 14.33 270.3 0 288 0C429.4 0 544 114.6 544 256C544 302.6 531.5 346.4 509.7 384C500.9 399.3 481.3 404.6 465.1 395.7C450.7 386.9 445.5 367.3 454.3 351.1C470.6 323.8 480 291 480 255.1C480 149.1 394 63.1 288 63.1C270.3 63.1 256 49.67 256 31.1V32z" />
                </svg>
            </template>
            <template v-else-if="noResults">
                <div class="results-no-results">
                    No pokedex entries found.
                    <img src="../assets/sad-pikachu.jpeg" />
                    Keep exploring!
                </div>
            </template>
            <template v-else v-for="pokemon in pokemonData">
                <keep-alive :key="pokemon['name']">
                    <PokemonCard
                        v-bind="pokemon"
                        :key="pokemon['name']"
                        :name="pokemon['name']"
                        :imgSrc="imageUrl(pokemon['id'])"
                    />
                </keep-alive>
            </template>
        </div>
        <div class="results-footer">
            <button @click="getPrevious()" :disabled="noResults || this.page === 1">Previous 12</button><button @click="getNext()" :disabled="noResults">Next 12</button>
        </div>
    </div>
</template>

<script>
import { HTTP } from '@/api'
import FormRadio from './FormRadio.vue'
import PokemonCard from './PokemonCard.vue'

export default {
    name: 'PokemonResults',
    components: {
        FormRadio,
        PokemonCard
    },
    data () {
        return {
            loading: undefined,
            allPokemon: [],
            page: 1,
            sort: 'id'
        }
    },
    computed: {
        pokemonData () {
            // Only show 12 pokemon at a time.
            return this.allPokemon.filter((pokemon, key) => {
                return (key >= (this.maxID - 12)) && (key < this.maxID)
            })
        },
        maxID () {
            return this.page * 12
        },
        noResults () {
            return !this.pokemonData.length
        },
        resultsClasses () {
            if (this.noResults) {
                return 'results-full results-full--no-results'
            }

            return 'results-full'
        }
    },
    methods: {
        imageUrl(id) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        },
        getNext() {
            this.page += 1
        },
        getPrevious() {
            this.page -= 1
        },
        async getPokemon() {
            // Hydrate our pokemon data from local storage if it exists to avoid many API calls.
            if (localStorage.getItem('allPokemon')) {
                this.allPokemon = JSON.parse(localStorage.getItem('allPokemon'));
                return
            }
            this.loading = true;

            // Fetch the first 50.
            const { data } = await HTTP.get(`pokemon/?limit=50&offset=0`)
            this.allPokemon = data.results.map((pokemon, key) => {
                return {
                    'id': key + 1,
                    'name': pokemon['name'][0].toUpperCase() + pokemon['name'].slice(1)
                }
            })
            this.loading = false;
            this.getAllPokemon()
        },
        async getAllPokemon() {
            let uri = 'pokemon/?limit=100&offset=50'
            do {
                let { data } = await HTTP.get(uri)
                this.allPokemon = this.allPokemon.concat(data.results.map(pokemon => {
                    return {
                        'id': + pokemon['url'].slice(34, -1),
                        'name': pokemon['name'][0].toUpperCase() + pokemon['name'].slice(1)
                    }
                }))

                if (data.next) {
                    uri = data.next.replace('https://pokeapi.co/api/v2/', '')
                } else {
                    uri = ''
                }
            } while (uri);
            localStorage.setItem('allPokemon', JSON.stringify(this.allPokemon));
        }
    },
    created () {
        this.getPokemon()
    },
    watch: {
        sort: function (val) {
            this.page = 1
            if (val === 'name') {
                this.allPokemon = this.allPokemon.sort((a, b) => a.name.localeCompare(b.name))
            } else {
                this.allPokemon = this.allPokemon.sort((a, b) => a.id - b.id)
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Results Container */
.results-body {
    font-size: calc(10px + 2vmin);
    color: #363545;
    min-height: 100vh;
    max-width: 1030px;
    margin: 0 auto;
}

/* Results */
.results-full {
    margin-top: 20px;
}
.results-full:not(.results-full--no-results) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px;
}
.results-loading {
    animation-name: spin;
    animation-duration: 2000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    width: 28px;
    padding: 5px;
}
@keyframes spin {
    from { transform: rotate(0deg) }
    to { transform: rotate(360deg) }
}

/* Results Header and Filters */
.results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 32px;
    line-height: 36px;
    letter-spacing: 0.64px;
}
.results-header fieldset {
    display: flex;
    font-size: 20px;
    padding: 0px;
    margin: 0px;
    border: 0px;
}
.results-header fieldset div {
    padding: 7px;
}

/* No Results Template */
.results-no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.results-no-results img {
    max-width: 400px;
    margin: 20px;
}

/* Results Footer */
.results-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
}
</style>
