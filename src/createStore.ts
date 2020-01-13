import Store, { Selectors, SelectorsBase, State } from './Store';

export default function createStore<T extends State, U extends SelectorsBase<T>>(
  initialState: T,
  selectors: Selectors<T, U>
): Store<T, U> {
  return new Store(initialState, selectors);
}
