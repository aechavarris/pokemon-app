// pokemon.model.ts
export interface User {
    id: number;
    username: string;
    password: string;
  }

let lastGeneratedId = 0;

export function createUserFromJson(jsonData: any): User {
  // Generar un nuevo ID único para el usuario
  const newId = ++lastGeneratedId;
    debugger;
  return {
    id: newId,
    username: jsonData[1],
    password: jsonData[2],
    // Aquí puedes asignar otros campos del objeto jsonData según el modelo User
  };
}