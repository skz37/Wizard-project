export type House = "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff";

export interface Wizard {
  id: string;
  name: string;
  house: House;
  age: number;
}

// L'identifiant est une responsabilité de l'application, pas de l'appelant.
export type NewWizard = Omit<Wizard, "id">;

