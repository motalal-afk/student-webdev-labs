const pokemonColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#e38e8b",
  poison: "#ea7ce8",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#a88fc8",
  dragon: "#9c77fa",
  dark: "#b5947e",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

// Add your code here

let allPokemon = [];

const createNewElement = function (data) {
  const { name: pokemonName, types } = data;
  const { front_default: pokemonImage } =
    data.sprites.other["official-artwork"];

  const pokemonTypesArr = types.map((item) => item.type.name);

  const card = document.createElement("div");
  const h2 = document.createElement("h2");
  const img = document.createElement("img");
  const typesDiv = document.createElement("div");

  h2.textContent = pokemonName;
  img.src = pokemonImage;
  img.alt = pokemonName;
  img.width = "240";
  img.height = "240";

  card.setAttribute("class", "pokemon-card");

  pokemonTypesArr.map((item) => {
    const span = document.createElement("span");
    span.textContent = item;
    span.style.backgroundColor = pokemonColors[item];
    span.setAttribute("class", "pokemon-type");
    typesDiv.append(span);
  });

  card.append(h2, img, typesDiv);

  return card;
};

const displayPokemon = function (pokemonArray) {
  const pokeList = document.querySelector(".poke-list");

  pokeList.innerHTML = "";

  if (pokemonArray.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No Pokémon matched your search.";
    message.setAttribute("class", "error-message");

    pokeList.append(message);
    return;
  }

  pokemonArray.forEach((pokemon) => {
    const elem = createNewElement(pokemon);
    pokeList.append(elem);
  });
};

const fetchDataAll = async function () {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=25&offset=0";

  const pokeList = document.querySelector(".poke-list");

  try {
    const response = await fetch(url);
    const data = await response.json();

    const pokemonLists = data.results;

    console.log(data.results);

    const promises = pokemonLists.map((pokemon) =>
      fetch(pokemon.url)
        .then((response) => response.json())
        .catch((error) => console.error("an error occured")),
    );

    const pokemonData = await Promise.all(promises);

    console.log(pokemonData);

    allPokemon = pokemonData;

    displayPokemon(allPokemon);
  } catch (error) {
    console.error("Error fetching data from the PokeAPI", error);
    const errorElement = document.createElement("p");
    errorElement.textContent = "Error fetching data from the PokeAPI";
    errorElement.setAttribute("class", "error-message");
    pokeList.append(errorElement);
  } finally {
    console.log("Executes either way");
    const loading = document.querySelector(".loading-container");
    loading.setAttribute("class", "display-none");
  }

  const searchInput = document.querySelector(".pokemon-search");

  searchInput.addEventListener("input", function (event) {
    const searchTerm = event.target.value.toLowerCase().trim();

    const filteredPokemon = allPokemon.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(searchTerm);
    });

    displayPokemon(filteredPokemon);
  });
};

fetchDataAll();
