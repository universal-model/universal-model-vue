// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type State = { [key: string]: any };

export type SelectorsBase<T extends State> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (state: T) => any;
};

export type Selectors<T extends State, U extends SelectorsBase<T>> = {
  [K in keyof U]: (state: T) => ReturnType<U[K]>;
};

export default class Store<T extends State, U extends SelectorsBase<T>> {
  private readonly state: T;
  private readonly selectors?: Selectors<T, U>;

  constructor(initialState: T, selectors?: Selectors<T, U>) {
    this.state = initialState;
    this.selectors = selectors;
  }

  getState(): T {
    return this.state;
  }

  getSelectors(): Selectors<T, U> | null | undefined {
    return this.selectors;
  }
}
