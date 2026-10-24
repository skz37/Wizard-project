import { WizardController } from "./controllers/wizard-controller.js";
import { Cache } from "./decorators.js";
import { isWizard } from "./guards.js";
import { InMemoryWizardRepository, SpellRepository } from "./repository.js";
import {
  IncrementalWizardIdGenerator,
  WizardService,
} from "./services/wizard-service.js";
import type { NewWizard, SpellCastEvent } from "./types.js";

function handleSpellCast(event: SpellCastEvent): void {
  console.log(`Le sorcier ${event.wizardId} lance ${event.spellName}.`);
}

class SpellCalculator {
  calculationCount = 0;

  @Cache
  calculatePower(basePower: number, multiplier: number): number {
    this.calculationCount += 1;
    return basePower * multiplier;
  }
}

const repository = new InMemoryWizardRepository();
const service = new WizardService(repository, new IncrementalWizardIdGenerator());
const controller = new WizardController(service);

// Test de l'exercice 1 : l'appelant ne fournit aucun id.
const harry: NewWizard = {
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
};

const registeredWizard = controller.register(harry);

if (registeredWizard.id !== 1) {
  throw new Error("Wizard id was not assigned by the application.");
}

if (repository.findById(registeredWizard.id)?.name !== harry.name) {
  throw new Error("Wizard was not persisted.");
}

// Test de l'exercice 2 : seuls les sorciers de la maison demandée sont retournés.
controller.register({
  name: "Hermione Granger",
  house: "Gryffindor",
  level: 5,
  active: true,
});
controller.register({
  name: "Draco Malfoy",
  house: "Slytherin",
  level: 5,
  active: true,
});

const gryffindors = repository.findByHouse("Gryffindor");

if (gryffindors.length !== 2 || gryffindors.some((wizard) => wizard.house !== "Gryffindor")) {
  throw new Error("Le filtrage par maison ne retourne pas le résultat attendu.");
}

console.log("Exercices 1 et 2 validés :", gryffindors);

// Test de l'exercice 3 : le gestionnaire n'accepte que les événements de sort.
handleSpellCast({
  type: "spell-cast",
  wizardId: 1,
  spellName: "Expelliarmus",
});

// Test de l'exercice 4 : un sort valide est conservé, un sort négatif est refusé.
const spells = new SpellRepository();
spells.add({ id: 102, name: "Protego", category: "defense", power: 50 });

if (spells.findById(102)?.power !== 50) {
  throw new Error("Le sort valide n'a pas été enregistré.");
}

try {
  spells.add({ id: 103, name: "Sort invalide", category: "attack", power: -10 });
  throw new Error("Le sort à puissance négative aurait dû être refusé.");
} catch (error) {
  if (!(error instanceof Error) || error.message !== "La puissance d'un sort ne peut pas être négative.") {
    throw error;
  }
}

console.log("Exercice 4 validé : la puissance négative est refusée.");

// Test de l'exercice 5 : les mêmes arguments sont calculés une seule fois par instance.
const calculator = new SpellCalculator();
const firstResult = calculator.calculatePower(10, 3);
const cachedResult = calculator.calculatePower(10, 3);
const secondResult = calculator.calculatePower(5, 2);

if (
  firstResult !== 30 ||
  cachedResult !== 30 ||
  secondResult !== 10 ||
  calculator.calculationCount !== 2
) {
  throw new Error("Le cache ne retourne pas les résultats attendus.");
}

const anotherCalculator = new SpellCalculator();
anotherCalculator.calculatePower(10, 3);

if (anotherCalculator.calculationCount !== 1) {
  throw new Error("Le cache doit être indépendant pour chaque instance.");
}

console.log("Exercice 5 validé : le cache est séparé par instance.");

// Test de l'exercice 6 : une maison inconnue ne peut pas valider un sorcier.
const validData: unknown = {
  id: 4,
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
};
const invalidData: unknown = {
  id: 5,
  name: "Viktor Krum",
  house: "Durmstrang",
  level: 5,
  active: true,
};

if (!isWizard(validData) || isWizard(invalidData)) {
  throw new Error("Le type guard des maisons ne valide pas correctement les données.");
}

console.log("Exercice 6 validé : seules les maisons autorisées sont acceptées.");
