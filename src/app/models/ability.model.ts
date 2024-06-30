export interface Ability {
  id: number;
  name: string;
  effect_entries: Effect[];
}

export interface Effect{
  effect: string, 
  short_effect: string,
  language:{
    name: string,
    url: string
  }
}