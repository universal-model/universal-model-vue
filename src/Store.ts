import { BehaviorSubject } from 'rxjs';

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
  private readonly observableState: BehaviorSubject<T>;
  private readonly selectors?: Selectors<T, U>;

  constructor(initialState: T, selectors?: Selectors<T, U>) {
    this.observableState = new BehaviorSubject(initialState);
    this.selectors = selectors;
  }

  getObservableState(): BehaviorSubject<T> {
    return this.observableState;
  }

  getSelectors(): Selectors<T, U> | null | undefined {
    return this.selectors;
  }

  patchState(partialState: Partial<T>): void {
    this.observableState.next({
      ...this.observableState.getValue(),
      ...partialState
    });
  }
}
