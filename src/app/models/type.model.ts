// pokemon.model.ts
export interface Type {
  name: string,
  url: string
  }
  
  export const typeEffectiveness: { [key: string]: { [key: string]: number } } = {
    normal: { fighting: 2, ghost: 0 },
    fire: { ground: 2, fire: 0.5, water: 2, grass: 0.5, ice: 0.5, bug: 0.5, rock: 2, steel: 0.5, fairy:2 },
    water: { fire: 0.5, water: 0.5, grass: 2, electric: 2, ice: 0.5, steel: 0.5},
    electric: { electric: 0.5, ground: 2, flying: 0.5, steel: 0.5 },
    grass: { fire: 2, water: 0.5, grass: 0.5, poison: 2, ground: 0.5, flying: 2, bug: 2, electric: 0.5, ice:2},
    ice: { fire: 2, water: 0.5,  ice: 0.5, steel: 2, fighting:2, rock: 2 },
    fighting: { flying: 2, psychic: 2, bug: 0.5, dark:0.5, fairy:2 },
    poison: { grass: 0.5, poison: 0.5, ground: 2, fairy: 0.5, fighting:0.5, bug:0.5, psychic:2 },
    ground: { poison: 0.5, rock: 0.5, water:2, grass:2, ice:2, electric:0},
    flying: { electric: 2, grass: 0.5, fighting: 0.5, bug: 0.5, rock: 2, ground:0 , ice: 2},
    psychic: { fighting: 0.5, psychic: 0.5, dark: 2, bug: 2, ghost:2 },
    bug: { fire: 2, grass: 0.5, fighting: 0.5, flying: 2, ground: 0.5, rock:2,},
    rock: { fire: 0.5, fighting: 2, ground: 2, flying: 0.5, steel: 2 , normal: 0.5, poison:0.5, water:2, grass: 2},
    ghost: { normal: 0, fighting: 0, ghost: 2, dark: 2 , poison: 0.5, bug: 0.5},
    dragon: { dragon: 2, ice:2, fairy: 2,electric: 0.5, fire: 0.5, water: 0.5, grass: 0.5 },
    dark: { fighting: 2, psychic: 0, ghost: 0.5, dark: 0.5, fairy: 2, bug:2 },
    steel: { normal: 0.5, fighting: 2, flying: 0.5, poison: 0, fire: 2, ice: 0.5, rock: 0.5, steel: 0.5, fairy: 0.5, grass: 0.5, psychic: 0.5, dragon: 0.5, ground:2, bug: 0.5},
    fairy: { bug: 0.5, fighting: 0.5, poison: 2, dragon: 0, dark: 0.5, steel: 2 }
  };
  
  export interface Weakness {
    type: Type,
    weakness: number
  }