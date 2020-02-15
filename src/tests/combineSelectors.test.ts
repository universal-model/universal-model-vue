import { combineSelectors } from '../combineSelectors';
import createSubState from '../createSubState';

const initialState = { subState1: createSubState({ value: 0 }) };
type State = typeof initialState;

const selectorObject1 = {
  selector1: (state: State) => state.subState1.value + 1,
  selector2: (state: State) => state.subState1.value + 2
};

describe('combineSelectors', () => {
  it('should combine selectors successfully', () => {
    // GIVEN
    const selectorObject2 = {
      selector3: (state: State) => state.subState1.value + 3
    };

    // WHEN
    const combinedSelectors = combineSelectors<State, typeof selectorObject1, typeof selectorObject2>(
      selectorObject1,
      selectorObject2
    );

    // THEN
    expect(combinedSelectors.selector1(initialState)).toBe(1);
    expect(combinedSelectors.selector2(initialState)).toBe(2);
    expect(combinedSelectors.selector3(initialState)).toBe(3);
  });

  it('should throw error if two selector objects contains overlapping keys', () => {
    // GIVEN
    const selectorObject2 = {
      selector1: (state: State) => state.subState1.value + 3
    };

    expect(() => {
      // WHEN
      combineSelectors<State, typeof selectorObject1, typeof selectorObject2>(
        selectorObject1,
        selectorObject2
      );

      // THEN
    }).toThrowError('duplicate selector key: selector1');
  });
});
