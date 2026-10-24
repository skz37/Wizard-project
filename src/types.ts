export type House = "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff";

export interface Wizard {
  id: string;
  name: string;
  house: House;
  age: number;
}

// L'identifiant est une responsabilité de l'application, pas de l'appelant.
export type NewWizard = Omit<Wizard, "id">;

export type AcademyEvent =
  | { type: "spell-cast"; wizardId: number; spellName: string }
  | { type: "level-up"; wizardId: number; newLevel: number }
  | { type: "wizard-expelled"; wizardId: number };

export type SpellCastEvent = Extract<AcademyEvent, { type: "spell-cast" }>;

export interface Spell {
  id: number;
  name: string;
  category: string;
  power: number;
}

