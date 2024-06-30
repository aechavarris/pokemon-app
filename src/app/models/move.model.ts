import { Type } from "./type.model";

// pokemon.model.ts
export interface Move {
    accuracy: number,
    contest_combos: any,
    contest_effect: any,
    contest_type: any,
    damage_class: any,
    effect_chance: any,
    effect_changes: any,
    effect_entries: any,
    flavor_text_entries: any,
    generation: any,
    id: number,
    learned_by_pokemon: any
    machines: any
    meta: any
    name: string
    names: any
    past_values: any 
    power: number
    pp: number
    priority: number
    stat_changes: any 
    type: Type
  }
  