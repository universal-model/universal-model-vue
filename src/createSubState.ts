export type SubStateFlagWrapper = {
  readonly __isSubState__: boolean;
};

type AllowedSubStateProperties<T extends object> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: K extends '__isSubState__' ? never : any;
};

export default function createSubState<T extends object>(
  subState: T & AllowedSubStateProperties<T>
): T & SubStateFlagWrapper {
  if (Object.keys(subState).includes('__isSubState__')) {
    throw new Error('createSubState: subState may not contain key: __isSubState__');
  }

  return {
    ...subState,
    __isSubState__: true
  };
}
