import createSubState from '../createSubState';

describe('createSubState', () => {
  it('should create sub-state from initial state object successfully', () => {
    // WHEN
    const subState = createSubState({ value: 1 });

    // THEN
    expect(subState.__isSubState__).toBe(true);
  });

  it('should throw error if initial state object contains key: __isSubState__', () => {
    expect(() => {
      // WHEN
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      createSubState({ __isSubState__: 1 });

      // THEN
    }).toThrowError('createSubState: subState may not contain key: __isSubState__');
  });
});
