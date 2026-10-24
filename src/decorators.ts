/** Refuse l'ajout d'un sort lorsque son premier argument a une puissance négative. */
export function ValidateSpellPower(
  _target: object,
  _propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): void {
  const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

  descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
    const candidate = args[0];

    if (
      typeof candidate === "object" &&
      candidate !== null &&
      "power" in candidate &&
      typeof candidate.power === "number" &&
      candidate.power < 0
    ) {
      throw new Error("La puissance d'un sort ne peut pas être négative.");
    }

    return originalMethod.apply(this, args);
  };
}
