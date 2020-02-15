import createSubState from '../createSubState';
import createStore from '../createStore';

describe('createStore', () => {
  it('should create a store successfully', () => {
    // GIVEN
    const initialState = { subState1: createSubState({ value: 0 }) };
    type State = typeof initialState;

    const selectors = {
      selector1: (state: State) => state.subState1.value + 1
    };

    // WHEN
    const store = createStore<State, typeof selectors>(initialState, selectors);

    // THEN
    expect(store.getState().subState1).toStrictEqual({ value: 0, __isSubState__: true });
    expect(store.getSelectors().selector1.value).toBe(1);
  });

  it('should throw an error if one of sub-state is not a sub-state', () => {
    // GIVEN
    const initialState = { subState1: { value: 0 } };
    type State = typeof initialState;

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      createStore(initialState, {});
    }).toThrowError(
      'createStore: One of given subStates is not subState. You must call createSubState(subState)'
    );
  });
});
