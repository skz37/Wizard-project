import { ValidateSpellPower } from "./decorators.js";
import type { Spell, Wizard } from "./types.js";

export class Repository<T extends { id: string | number }> {
  protected readonly entities = new Map<T["id"], T>();

  add(entity: T): void {
    if (this.entities.has(entity.id)) {
      throw new Error(`Une entité avec l'identifiant "${entity.id}" existe déjà.`);
    }

    this.entities.set(entity.id, entity);
  }

  findById(id: T["id"]): T | undefined {
    return this.entities.get(id);
  }
}

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

export class SpellRepository extends Repository<Spell> {
  @ValidateSpellPower
  override add(spell: Spell): void {
    super.add(spell);
  }
}

