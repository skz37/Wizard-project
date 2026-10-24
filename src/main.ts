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

// Test de l'exercice 2 : seuls les sorciers de la maison demandée sont retournés.
controller.register({
  name: "Hermione Granger",
  house: "Gryffindor",
  age: 11,
});
controller.register({
  name: "Draco Malfoy",
  house: "Slytherin",
  age: 11,
});

const gryffindors = repository.findByHouse("Gryffindor");

if (gryffindors.length !== 2 || gryffindors.some((wizard) => wizard.house !== "Gryffindor")) {
  throw new Error("Le filtrage par maison ne retourne pas le résultat attendu.");
}

console.log("Exercices 1 et 2 validés :", gryffindors);
