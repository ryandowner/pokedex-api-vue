<template>
    <div class="card">
        <div class="card-image">
            <img :src="imgSrc" :alt="name" />
        </div>
        <div class="card-name">{{ name }}</div>
    </div>
</template>

<script>
export default {
  name: 'PokemonCard',
  props: {
    name: String,
    imgSrc: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
    border-radius: 16px;
    background: #FDFDFD;
    display: flex;
    align-items: center;
    padding: 12px;
    grid-gap: 12px;
}
.card-image {
    display: flex;
    width: 60px;
}
.card-image img {
    height: 60px;
    background: rgb(232, 232, 232);
    border-radius: 35px;
}
.card-name {
    font-size: 20px;
    flex: 1;
    text-align: left;
}

</style>
