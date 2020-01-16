import { computed, reactive } from 'vue';
import { ComputedRef, UnwrapRef, Ref } from 'vue';
import Store, { SelectorsBase, State } from './Store';

type ComputedSelectors<T extends State, U extends SelectorsBase<T>> = {
  [K in keyof U]: ComputedRef<ReturnType<U[K]>>;
};

export default function getStateAndSelectors<T extends State, U extends SelectorsBase<T>>(
  store: Store<T, U>
): [T extends Ref ? T : UnwrapRef<T>, ComputedSelectors<T, U>] {
  const reactiveState = reactive(store.getState());

  const reactiveSelectors = {} as ComputedSelectors<T, U>;
  const selectors = store.getSelectors();
  if (selectors) {
    Object.keys(selectors).forEach(
      (key: keyof U) =>
        (reactiveSelectors[key] = computed(() =>
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          selectors[key](reactiveState)
        ))
    );
  }

  return [reactiveState, reactiveSelectors];
}
