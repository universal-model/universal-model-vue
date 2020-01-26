const isSubStateSymbol = Symbol();

export default function createSubState<T extends object>(subState: T): T {
  return {
    [isSubStateSymbol]: true,
    ...subState
  };
}
