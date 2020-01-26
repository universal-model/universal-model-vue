import * as _ from 'lodash';
import { Selectors, SelectorsBase, State } from './Store';

export default function<T extends State, U extends SelectorsBase<T>>(
  selectorsObjects: Array<Selectors<T, SelectorsBase<T>>>
): Selectors<T, U> {
  return _.mergeWith(
    selectorsObjects[0],
    ...selectorsObjects.slice(1),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (objValue: any, srcValue: any, key: string) => {
      if (!_.isUndefined(objValue)) throw new Error(`duplicate selector key: ${key}`);
    }
  );
}
