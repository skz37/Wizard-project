import { WizardController } from "./controllers/wizard-controller.js";
import { InMemoryWizardRepository } from "./repository.js";
import {
  IncrementalWizardIdGenerator,
  WizardService,
} from "./services/wizard-service.js";
import type { NewWizard } from "./types.js";

const repository = new InMemoryWizardRepository();
const service = new WizardService(repository, new IncrementalWizardIdGenerator());
const controller = new WizardController(service);

// Test de l'exercice 1 : l'appelant ne fournit aucun id.
const harry: NewWizard = {
  name: "Harry Potter",
  house: "Gryffindor",
  age: 11,
};

const registeredWizard = controller.register(harry);

if (registeredWizard.id !== "wizard-1") {
  throw new Error("Wizard id was not assigned by the application.");
}

if (repository.findById(registeredWizard.id)?.name !== harry.name) {
  throw new Error("Wizard was not persisted.");
}

console.log("Exercise 1 passed:", registeredWizard);
