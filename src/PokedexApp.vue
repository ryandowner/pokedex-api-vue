<template>
    <div id="pokedex-app">
        <PokemonResults />
    </div>
</template>

<script>
import PokemonResults from "./components/PokemonResults.vue";

export default {
    name: 'PokedexApp',
    components: {
        PokemonResults,
    },
};
</script>

<style>
#pokedex-app {
    font-family: 'Encode Sans';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    padding: 48px;
    background: #F6F6F7;
    color: #23292B;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.40px;
    word-wrap: break-word;
}
</style>
