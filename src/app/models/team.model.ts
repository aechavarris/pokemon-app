import { Pokemon } from "./pokemon.model";
  // team.model.ts
  export interface Team {
    userId: number;
    id: number;
    name: string;
    pokemons: Pokemon[];
  }
  let lastGeneratedTeamId = 0;
// Función para crear un equipo desde JSON
export function createTeamFromJson(jsonData: any): Team {
  const newId = ++lastGeneratedTeamId;
  return {
    userId: jsonData[1], // Asumiendo que el JSON ya tiene un ID único
    id: newId,
    name: jsonData[2],
    pokemons: [jsonData[3],jsonData[4],jsonData[5],jsonData[6],jsonData[7],jsonData[8],jsonData[9], jsonData[10], jsonData[11], jsonData[12]]
    // Puedes asignar otros campos del objeto jsonData según el modelo Team
  };
}
export { Pokemon };

