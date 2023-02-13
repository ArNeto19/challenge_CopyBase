<script lang="ts">
import PokeCard from "../components/PokeData/PokeCard.vue";
import Search from "../components/Search/Search.vue";

import { getPokemonByName, getEvolutionChain } from "../services/apiService";
import { IPokemon } from "../utils/pokemon-interface";

export default {
  components: {
    PokeCard,
    Search,
  },
  data() {
    return {
      pokemon: {} as IPokemon,
    };
  },
  methods: {
    searchPokemon() {
      try {
        getPokemonByName(1).then((data) => {
          getEvolutionChain(data.id).then((res) => {
            if (res.chain.evolves_to.length > 0) {
              for (let i = 0; i < res.chain.evolves_to.length; i++) {
                this.getPokemonFromEvolutionChain(res.chain.evolves_to[i]);
              }
            }
          });

          return (this.pokemon = {
            id: data.id,
            name: data.name,
            sprites: data.sprites,
            stats: data.stats,
            types: data.types,
          });
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getPokemonFromEvolutionChain(evolution: any) {
      let pokeEvolution = await getPokemonByName(evolution.species.name);
      let evolutionChain = [];

      if (evolution.evolves_to.length > 0) {
        for (let i = 0; i < evolution.evolves_to.length; i++) {
          let el = evolution.evolves_to[i];
          let nextEvolutionChain = [];
          let ev = await this.getPokemonFromEvolutionChain(el);

          nextEvolutionChain.push(ev);
          pokeEvolution.evolutions = nextEvolutionChain;

          evolutionChain.push(pokeEvolution);
          this.pokemon.evolutions = evolutionChain;
        }
        return
      }
      evolutionChain.push(pokeEvolution);
      this.pokemon.evolutions = evolutionChain;
      return pokeEvolution;
    },
  },
};
</script>

<template>
  <div style="display: flex; flex-direction: column; align-items: center">
    <Search  />
    <button @click="searchPokemon">Search</button>
  </div>
  <div v-if="pokemon.id">
    <PokeCard
      :id="pokemon?.id"
      :name="pokemon?.name"
      :sprites="pokemon?.sprites"
      :types="pokemon?.types"
      :stats="pokemon?.stats"
      :evolutions="pokemon?.evolutions" />
  </div>
</template>

<style lang="scss">
@import "../style.scss";
</style>
