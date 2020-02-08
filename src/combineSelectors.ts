import mergeWith from 'lodash/mergeWith';
import isUndefined from 'lodash/isUndefined';
import { Selectors, SelectorsBase, State } from './Store';

export function combineSelectors<T extends State, U1 extends SelectorsBase<T>, U2 extends SelectorsBase<T>>(
  selectorsObject1: Selectors<T, U1>,
  selectorsObject2: Selectors<T, U2>
): Selectors<T, U1> & Selectors<T, U2>;

export function combineSelectors<
  T extends State,
  U1 extends SelectorsBase<T>,
  U2 extends SelectorsBase<T>,
  U3 extends SelectorsBase<T>
>(
  selectorsObject1: Selectors<T, U1>,
  selectorsObject2: Selectors<T, U2>,
  selectorsObject3: Selectors<T, U3>
): Selectors<T, U1> & Selectors<T, U2> & Selectors<T, U3>;

export function combineSelectors<
  T extends State,
  U1 extends SelectorsBase<T>,
  U2 extends SelectorsBase<T>,
  U3 extends SelectorsBase<T>,
  U4 extends SelectorsBase<T>
>(
  selectorsObject1: Selectors<T, U1>,
  selectorsObject2: Selectors<T, U2>,
  selectorsObject3: Selectors<T, U3>,
  selectorsObject4: Selectors<T, U4>
): Selectors<T, U1> & Selectors<T, U2> & Selectors<T, U3> & Selectors<T, U4>;

export function combineSelectors<
  T extends State,
  U1 extends SelectorsBase<T>,
  U2 extends SelectorsBase<T>,
  U3 extends SelectorsBase<T>,
  U4 extends SelectorsBase<T>,
  U5 extends SelectorsBase<T>
>(
  selectorsObject1: Selectors<T, U1>,
  selectorsObject2: Selectors<T, U2>,
  selectorsObject3: Selectors<T, U3>,
  selectorsObject4: Selectors<T, U4>,
  selectorsObject5: Selectors<T, U5>
): Selectors<T, U1> & Selectors<T, U2> & Selectors<T, U3> & Selectors<T, U4> & Selectors<T, U5>;

export function combineSelectors<
  T extends State,
  U1 extends SelectorsBase<T>,
  U2 extends SelectorsBase<T>,
  U3 extends SelectorsBase<T>,
  U4 extends SelectorsBase<T>,
  U5 extends SelectorsBase<T>,
  U6 extends SelectorsBase<T>
>(
  selectorsObject1: Selectors<T, U1>,
  selectorsObject2: Selectors<T, U2>,
  selectorsObject3: Selectors<T, U3>,
  selectorsObject4: Selectors<T, U4>,
  selectorsObject5: Selectors<T, U5>,
  selectorsObject6: Selectors<T, U6>
): Selectors<T, U1> &
  Selectors<T, U2> &
  Selectors<T, U3> &
  Selectors<T, U4> &
  Selectors<T, U5> &
  Selectors<T, U6>;

export function combineSelectors<
  T extends State,
  U1 extends SelectorsBase<T>,
  U2 extends SelectorsBase<T>,
  U3 extends SelectorsBase<T>,
  U4 extends SelectorsBase<T>,
  U5 extends SelectorsBase<T>,
  U6 extends SelectorsBase<T>,
  U7 extends SelectorsBase<T>
>(
  selectorsObject1: Selectors<T, U1>,
  selectorsObject2: Selectors<T, U2>,
  selectorsObject3: Selectors<T, U3>,
  selectorsObject4: Selectors<T, U4>,
  selectorsObject5: Selectors<T, U5>,
  selectorsObject6: Selectors<T, U6>,
  selectorsObject7: Selectors<T, U7>
): Selectors<T, U1> &
  Selectors<T, U2> &
  Selectors<T, U3> &
  Selectors<T, U4> &
  Selectors<T, U5> &
  Selectors<T, U6> &
  Selectors<T, U7>;

export function combineSelectors<
  T extends State,
  U1 extends SelectorsBase<T>,
  U2 extends SelectorsBase<T>,
  U3 extends SelectorsBase<T>,
  U4 extends SelectorsBase<T>,
  U5 extends SelectorsBase<T>,
  U6 extends SelectorsBase<T>,
  U7 extends SelectorsBase<T>,
  U8 extends SelectorsBase<T>
>(
  selectorsObject1: Selectors<T, U1>,
  selectorsObject2: Selectors<T, U2>,
  selectorsObject3: Selectors<T, U3>,
  selectorsObject4: Selectors<T, U4>,
  selectorsObject5: Selectors<T, U5>,
  selectorsObject6: Selectors<T, U6>,
  selectorsObject7: Selectors<T, U7>,
  selectorsObject8: Selectors<T, U8>
): Selectors<T, U1> &
  Selectors<T, U2> &
  Selectors<T, U3> &
  Selectors<T, U4> &
  Selectors<T, U5> &
  Selectors<T, U6> &
  Selectors<T, U7> &
  Selectors<T, U8>;

export function combineSelectors<
  T extends State,
  U1 extends SelectorsBase<T>,
  U2 extends SelectorsBase<T>,
  U3 extends SelectorsBase<T>,
  U4 extends SelectorsBase<T>,
  U5 extends SelectorsBase<T>,
  U6 extends SelectorsBase<T>,
  U7 extends SelectorsBase<T>,
  U8 extends SelectorsBase<T>,
  U9 extends SelectorsBase<T>
>(
  selectorsObject1: Selectors<T, U1>,
  selectorsObject2: Selectors<T, U2>,
  selectorsObject3: Selectors<T, U3>,
  selectorsObject4: Selectors<T, U4>,
  selectorsObject5: Selectors<T, U5>,
  selectorsObject6: Selectors<T, U6>,
  selectorsObject7: Selectors<T, U7>,
  selectorsObject8: Selectors<T, U8>,
  selectorsObject9: Selectors<T, U9>
): Selectors<T, U1> &
  Selectors<T, U2> &
  Selectors<T, U3> &
  Selectors<T, U4> &
  Selectors<T, U5> &
  Selectors<T, U6> &
  Selectors<T, U7> &
  Selectors<T, U8> &
  Selectors<T, U9>;

export function combineSelectors<
  T extends State,
  U1 extends SelectorsBase<T>,
  U2 extends SelectorsBase<T>,
  U3 extends SelectorsBase<T>,
  U4 extends SelectorsBase<T>,
  U5 extends SelectorsBase<T>,
  U6 extends SelectorsBase<T>,
  U7 extends SelectorsBase<T>,
  U8 extends SelectorsBase<T>,
  U9 extends SelectorsBase<T>,
  U10 extends SelectorsBase<T>
>(
  selectorsObject1: Selectors<T, U1>,
  selectorsObject2: Selectors<T, U2>,
  selectorsObject3: Selectors<T, U3>,
  selectorsObject4: Selectors<T, U4>,
  selectorsObject5: Selectors<T, U5>,
  selectorsObject6: Selectors<T, U6>,
  selectorsObject7: Selectors<T, U7>,
  selectorsObject8: Selectors<T, U8>,
  selectorsObject9: Selectors<T, U9>,
  selectorsObject10: Selectors<T, U10>
): Selectors<T, U1> &
  Selectors<T, U2> &
  Selectors<T, U3> &
  Selectors<T, U4> &
  Selectors<T, U5> &
  Selectors<T, U6> &
  Selectors<T, U7> &
  Selectors<T, U8> &
  Selectors<T, U9> &
  Selectors<T, U10>;

export function combineSelectors<
  T extends State,
  U1 extends SelectorsBase<T>,
  U2 extends SelectorsBase<T>,
  U3 extends SelectorsBase<T>,
  U4 extends SelectorsBase<T>,
  U5 extends SelectorsBase<T>,
  U6 extends SelectorsBase<T>,
  U7 extends SelectorsBase<T>,
  U8 extends SelectorsBase<T>,
  U9 extends SelectorsBase<T>,
  U10 extends SelectorsBase<T>,
  U11 extends SelectorsBase<T>
>(
  selectorsObject1: Selectors<T, U1>,
  selectorsObject2: Selectors<T, U2>,
  selectorsObject3: Selectors<T, U3>,
  selectorsObject4: Selectors<T, U4>,
  selectorsObject5: Selectors<T, U5>,
  selectorsObject6: Selectors<T, U6>,
  selectorsObject7: Selectors<T, U7>,
  selectorsObject8: Selectors<T, U8>,
  selectorsObject9: Selectors<T, U9>,
  selectorsObject10: Selectors<T, U10>,
  selectorsObject11: Selectors<T, U11>
): Selectors<T, U1> &
  Selectors<T, U2> &
  Selectors<T, U3> &
  Selectors<T, U4> &
  Selectors<T, U5> &
  Selectors<T, U6> &
  Selectors<T, U7> &
  Selectors<T, U8> &
  Selectors<T, U9> &
  Selectors<T, U10> &
  Selectors<T, U11>;

export function combineSelectors<
  T extends State,
  U1 extends SelectorsBase<T>,
  U2 extends SelectorsBase<T>,
  U3 extends SelectorsBase<T>,
  U4 extends SelectorsBase<T>,
  U5 extends SelectorsBase<T>,
  U6 extends SelectorsBase<T>,
  U7 extends SelectorsBase<T>,
  U8 extends SelectorsBase<T>,
  U9 extends SelectorsBase<T>,
  U10 extends SelectorsBase<T>,
  U11 extends SelectorsBase<T>,
  U12 extends SelectorsBase<T>
>(
  selectorsObject1: Selectors<T, U1>,
  selectorsObject2: Selectors<T, U2>,
  selectorsObject3: Selectors<T, U3>,
  selectorsObject4: Selectors<T, U4>,
  selectorsObject5: Selectors<T, U5>,
  selectorsObject6: Selectors<T, U6>,
  selectorsObject7: Selectors<T, U7>,
  selectorsObject8: Selectors<T, U8>,
  selectorsObject9: Selectors<T, U9>,
  selectorsObject10: Selectors<T, U10>,
  selectorsObject11: Selectors<T, U11>,
  selectorsObject12: Selectors<T, U11>
): Selectors<T, U1> &
  Selectors<T, U2> &
  Selectors<T, U3> &
  Selectors<T, U4> &
  Selectors<T, U5> &
  Selectors<T, U6> &
  Selectors<T, U7> &
  Selectors<T, U8> &
  Selectors<T, U9> &
  Selectors<T, U10> &
  Selectors<T, U11> &
  Selectors<T, U12>;

export function combineSelectors<T extends State, U extends SelectorsBase<T>>(
  ...selectorsObjects: Array<Selectors<T, SelectorsBase<T>>>
): Selectors<T, U> {
  return mergeWith(
    selectorsObjects[0],
    ...selectorsObjects.slice(1),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (objValue: any, srcValue: any, key: string) => {
      if (!isUndefined(objValue)) throw new Error(`duplicate selector key: ${key}`);
    }
  );
}
