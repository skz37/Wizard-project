import type { NewWizard, Wizard } from "../types.js";
import type { WizardService } from "../services/wizard-service.js";

/** Point d'entrée MVC : le contrôleur délègue le cas d'usage au service. */
export class WizardController {
  constructor(private readonly wizardService: WizardService) {}

  register(input: NewWizard): Wizard {
    return this.wizardService.create(input);
  }
}

