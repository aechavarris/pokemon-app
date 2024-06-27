import { Pokemon } from './pokemon.model'; // Asegúrate de importar el modelo de Pokemon
let lastGeneratedTeamId = 0;
export interface Team {
  userId: number; // Ajusta el tipo según tu modelo de usuario
  id: number;
  name: string;
  pokemons: Pokemon[]; // Utiliza un array de Pokemon en lugar de simplemente strings
}

// Implementa la exportación de createTeamFromJson
export const createTeamFromJson = (jsonData: any, pokemonService: any): Promise<Team> => {
  return new Promise<Team>((resolve, reject) => {
    const newId = ++lastGeneratedTeamId;
    const teamName = jsonData.name;

    // Obtener los nombres de los Pokémon a partir de los índices 3 al 12 en jsonData
    const pokemonIndices = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Índices de los nombres de los Pokémon
    const pokemonNames = pokemonIndices.map(index => jsonData[index]);

    // Obtener los Pokemon completos a partir de los nombres usando pokemonService
    const pokemonPromises: Promise<Pokemon>[] = pokemonNames.map((name: string) => {
      return new Promise<Pokemon>((resolve, reject) => {
        pokemonService.getPokemonByName(name).subscribe(
          (pokemonData: any) => {
            const pokemon: Pokemon = {
              id: pokemonData.id,
              name: pokemonData.name,
              type: pokemonData.type,
              baseStats: { /* Define los stats base aquí */ },
              ivs: { /* Define los IVs aquí */ },
              evs: { /* Define los EVs aquí */ },
              moves: pokemonData.moves,
              ability: pokemonData.abilities,
              item: '' // Aquí puedes definir el ítem del Pokémon si es relevante
              ,
              sprites: {
                front_default: pokemonData.sprites.front_default,
                back_default: pokemonData.sprites.back_default
              },
              image: ''
            };
            resolve(pokemon);
          },
          (error: any) => {
            reject(error);
          }
        );
      });
    });

    Promise.all(pokemonPromises)
      .then((pokemons: Pokemon[]) => {
        const newTeam: Team = {
          userId: jsonData.userId,
          id: newId,
          name: teamName,
          pokemons: pokemons
        };
        resolve(newTeam);
      })
      .catch((error) => reject(error));
  });

};
