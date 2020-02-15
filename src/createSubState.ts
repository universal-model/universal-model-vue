export type SubStateFlagWrapper = {
  readonly __isSubState__: boolean;
};

type AllowedInitialStateProperties<T extends object> = {
  [K in keyof T]: K extends '__isSubState__' ? never : T[K];
};

type AllowedInitialStatePropertyValueType =
  | number
  | boolean
  | string
  | undefined
  | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Array<any>
  | object
  | Function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Map<any, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Set<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | WeakMap<any, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | WeakSet<any>;

export type InitialState<T> = {
  [K in keyof T]: T[K] extends AllowedInitialStatePropertyValueType ? T[K] : never;
};

export default function createSubState<T extends InitialState<T>>(
  initialState: T & AllowedInitialStateProperties<T>
): T & SubStateFlagWrapper {
  if (Object.keys(initialState).includes('__isSubState__')) {
    throw new Error('createSubState: subState may not contain key: __isSubState__');
  }

  return {
    ...initialState,
    __isSubState__: true
  };
}
