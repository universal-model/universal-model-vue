import Store, { Selectors, SelectorsBase, State, SubState } from './Store';

export default function createStore<T extends State, U extends SelectorsBase<T>>(
  initialState: T,
  selectors: Selectors<T, U>
): Store<T, U> {
  Object.entries(initialState).forEach(([, subState]: [string, SubState]) => {
    if (!subState.__isSubState__) {
      throw new Error(
        'createStore: One of given subStates is not subState. You must call createSubState(subState)'
      );
    }
  });

  return new Store(initialState, selectors);
}
