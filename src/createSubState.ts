export type SubStateFlagWrapper = {
  readonly __isSubState__: boolean;
};

type AllowedInitialStateProperties<T extends object> = {
  [K in keyof T]: K extends '__isSubState__' ? never : T[K];
};

type DisallowedInitialStatePropertyValueType =
  | Error
  | Date
  | RegExp
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | ArrayBuffer
  | DataView
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Promise<any>
  | Generator
  | GeneratorFunction
  | ProxyConstructor
  | Intl.Collator
  | Intl.DateTimeFormat
  | Intl.NumberFormat
  | Intl.PluralRules;

type AllowedInitialStatePropertyValueType =
  | number
  | boolean
  | string
  | undefined
  | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Array<any>
  | object
  | Function;

export type InitialState<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends DisallowedInitialStatePropertyValueType
    ? never
    : T[K] extends AllowedInitialStatePropertyValueType
    ? T[K]
    : never;
};

export default function createSubState<T extends InitialState<T>>(
  initialState: T & AllowedInitialStateProperties<T>
): T & SubStateFlagWrapper {
  if (Object.keys(initialState).includes('__isSubState__')) {
    throw new Error('createSubState: subState may not contain key: __isSubState__');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isInstanceOf<T extends new (...args: any[]) => any, U extends Function>(
    instance: InstanceType<T>,
    constructorFunction: U
  ): boolean {
    let instancePrototype = instance?.__proto__;
    const constructorPrototype = constructorFunction?.prototype;

    while (instancePrototype && constructorPrototype) {
      if (instancePrototype === constructorPrototype) {
        return true;
      }
      instancePrototype = instancePrototype.__proto__;
    }

    return false;
  }

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(initialState).forEach(([key, value]: [string, any]) => {
      if (
        isInstanceOf(value, Error) ||
        isInstanceOf(value, Date) ||
        isInstanceOf(value, RegExp) ||
        isInstanceOf(value, BigInt) ||
        isInstanceOf(value, Int8Array) ||
        isInstanceOf(value, Uint8Array) ||
        isInstanceOf(value, Uint8ClampedArray) ||
        isInstanceOf(value, Int16Array) ||
        isInstanceOf(value, Uint16Array) ||
        isInstanceOf(value, Int32Array) ||
        isInstanceOf(value, Uint32Array) ||
        isInstanceOf(value, Float32Array) ||
        isInstanceOf(value, Float64Array) ||
        isInstanceOf(value, BigInt64Array) ||
        isInstanceOf(value, BigUint64Array) ||
        isInstanceOf(value, ArrayBuffer) ||
        isInstanceOf(value, DataView) ||
        isInstanceOf(value, Promise) ||
        isInstanceOf(value, Proxy) ||
        isInstanceOf(value, Intl.Collator) ||
        isInstanceOf(value, Intl.DateTimeFormat) ||
        isInstanceOf(value, Intl.NumberFormat) ||
        isInstanceOf(value, Intl.PluralRules) ||
        (typeof value !== 'number' &&
          typeof value !== 'boolean' &&
          typeof value !== 'string' &&
          typeof value !== 'undefined' &&
          value !== null &&
          typeof value !== 'function' &&
          typeof value !== 'object')
      ) {
        throw new Error('Forbidden value type for key: ' + key);
      }
    });
  }

  return {
    ...initialState,
    __isSubState__: true
  };
}
