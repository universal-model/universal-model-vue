import { Ref, UnwrapRef, ComputedRef, reactive, computed } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type State = { [key: string]: any };

export type SelectorsBase<T extends State> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (state: T) => any;
};

export type Selectors<T extends State, U extends SelectorsBase<T>> = {
  [K in keyof U]: (state: T) => ReturnType<U[K]>;
};

type ComputedSelectors<T extends State, U extends SelectorsBase<T>> = {
  [K in keyof U]: ComputedRef<ReturnType<U[K]>>;
};

export default class Store<T extends State, U extends SelectorsBase<T>> {
  private readonly reactiveState: T extends Ref ? T : UnwrapRef<T>;
  private readonly reactiveSelectors: ComputedSelectors<T, U>;

  constructor(initialState: T, selectors?: Selectors<T, U>) {
    this.reactiveState = reactive(initialState);
    this.reactiveSelectors = {} as ComputedSelectors<T, U>;
    if (selectors) {
      Object.keys(selectors).forEach(
        (key: keyof U) =>
          (this.reactiveSelectors[key] = computed(() =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            selectors[key](reactiveState)
          ))
      );
    }
  }

  getStateAndSelectors(): [T extends Ref ? T : UnwrapRef<T>, ComputedSelectors<T, U>] {
    return [this.reactiveState, this.reactiveSelectors];
  }
}
