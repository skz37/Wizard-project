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

/** Met en cache le résultat d'une méthode synchrone, séparément pour chaque instance. */
export function Cache(
  _target: object,
  _propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): void {
  const originalMethod = descriptor.value as (...args: unknown[]) => unknown;
  const instanceCaches = new WeakMap<object, Map<string, unknown>>();

  descriptor.value = function (this: object, ...args: unknown[]): unknown {
    let cache = instanceCaches.get(this);

    if (!cache) {
      cache = new Map<string, unknown>();
      instanceCaches.set(this, cache);
    }

    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
