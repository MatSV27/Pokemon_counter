document.addEventListener("DOMContentLoaded", () => {
    const pokemonList = document.getElementById("pokemon-list");

    // Función para mostrar la descripción del Pokémon
    function showPokemonDescription(pokemonName, description) {
        const tooltip = document.createElement("div");
        tooltip.classList.add("pokemon-description");
        tooltip.innerHTML = `
            <h3>${pokemonName}</h3>
            <p>${description}</p>
        `;
        pokemonList.appendChild(tooltip);
    }

    // Función para ocultar la descripción del Pokémon
 //   function hidePokemonDescription() {
 //       const tooltip = document.querySelector(".pokemon-description");
 //       if (tooltip) {
 //           tooltip.remove();
 //       }
 //   }

    // Realiza una solicitud para obtener la lista de Pokémon
    fetch("https://pokeapi.co/api/v2/pokemon?limit=300")
        .then((response) => response.json())
        .then((data) => {
            const pokemons = data.results;
            pokemons.forEach((pokemon) => {
                // Realiza una solicitud para obtener los detalles de cada Pokémon
                fetch(pokemon.url)
                    .then((response) => response.json())
                    .then((pokemonData) => {
                        const pokemonName = pokemonData.name;
                        const pokemonImageURL = pokemonData.sprites.front_default;
                        const pokemonShiny = pokemonData.sprites.front_shiny;
                        const pokemonDescriptionURL = `https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}/`;
                        
                        // Agrega un evento mouseenter para mostrar la descripción y cambiar a la versión "shiny"
                        const pokemonElement = document.createElement("div");
                        pokemonElement.classList.add("pokemon");
                        pokemonElement.innerHTML = `
                            <h2>${pokemonName}</h2>
                            <img class=imgpokemon src="${pokemonImageURL}" onmouseout="this.src='${pokemonImageURL}';" onmouseover="this.src='${pokemonShiny}';"
                            alt="${pokemonName}">
                            <p></p>
                            <button onclick="showPokemonDescription('${pokemonName}', '${pokemonDescriptionURL}')">Ver descripción</button>
                            <p></p>
                        `;
                        
                        // Agrega un evento mouseenter para mostrar la descripción y cambiar a la versión "shiny"
                        pokemonElement.addEventListener("click", () => {
                            // Cambia la clase del Pokémon para aplicar los estilos "shiny"
                            pokemonElement.classList.add("shiny");

                            // Realiza una solicitud para obtener la descripción
                            fetch(pokemonDescriptionURL)
                                .then((response) => response.json())
                                .then((pokemonDescriptionData) => {
                                    const descriptions = pokemonDescriptionData.flavor_text_entries;
                                    // Encuentra la descripción en español si está disponible
                                    const description = descriptions.find((entry) => entry.language.name === "es").flavor_text;
                                    // Muestra la descripción
                                    showPokemonDescription(pokemonName, description);
                                })
                                .catch((error) => console.error("Error al obtener la descripción:", error));
                        });

                        // Agrega un evento mouseleave para ocultar la descripción y restaurar la clase al quitar el mouse
                        pokemonElement.addEventListener("mouseleave", () => {
                            // Restaura la clase original del Pokémon
                            pokemonElement.classList.remove("shiny");
                            // Oculta la descripción
                            hidePokemonDescription();
                        });

                        // Agrega el elemento del Pokémon a la lista
                        pokemonList.appendChild(pokemonElement);
                    });
            });
        })
        .catch((error) => console.error("Error:", error));
});