import axios from "axios";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

const getPokemonByName = async (name: number | string) => {
  const res = await api.get(`/pokemon/${name}`);

  return res.data;
};

const getEvolutionChain = async (id: number) => {
  const res = await api.get(`/pokemon-species/${id}`);

  const evolutionRes = await axios.get(res.data.evolution_chain.url);

  return evolutionRes.data;
};

export { getPokemonByName, getEvolutionChain };
