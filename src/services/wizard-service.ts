import type { WizardRepositoryPort } from "../repository.js";
import type { NewWizard, Wizard } from "../types.js";

export interface WizardIdGenerator {
  next(): number;
}

export class IncrementalWizardIdGenerator implements WizardIdGenerator {
  private sequence = 0;

  next(): number {
    this.sequence += 1;
    return this.sequence;
  }
}

export class WizardService {
  constructor(
    private readonly repository: WizardRepositoryPort,
    private readonly idGenerator: WizardIdGenerator,
  ) {}

  create(newWizard: NewWizard): Wizard {
    const wizard: Wizard = { ...newWizard, id: this.idGenerator.next() };
    this.repository.add(wizard);
    return wizard;
  }
}

