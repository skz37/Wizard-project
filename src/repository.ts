import type { Wizard } from "./types.js";

export interface WizardRepositoryPort {
  add(wizard: Wizard): void;
  findById(id: string): Wizard | undefined;
  findByHouse(house: Wizard["house"]): Wizard[];
}

/** Repository en mémoire, interchangeable avec une implémentation base de données. */
export class InMemoryWizardRepository implements WizardRepositoryPort {
  private readonly wizards = new Map<string, Wizard>();

  add(wizard: Wizard): void {
    if (this.wizards.has(wizard.id)) {
      throw new Error(`A wizard with id "${wizard.id}" already exists.`);
    }

    this.wizards.set(wizard.id, wizard);
  }

  findById(id: string): Wizard | undefined {
    return this.wizards.get(id);
  }

  findByHouse(house: Wizard["house"]): Wizard[] {
    return [...this.wizards.values()].filter((wizard) => wizard.house === house);
  }
}

