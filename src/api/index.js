import axios from 'axios'

export const HTTP = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/'
})