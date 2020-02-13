# API Documentation

## Vue API

### createSubState
    
    type SubStateFlagWrapper = {
      readonly __isSubState__: boolean;
    };
        
    type SubState = object & SubStateFlagWrapper;
    
    type AllowedSubStateProperties<T extends object> = {
      [K in keyof T]: K extends '__isSubState__' ? never : T[K];
    };
     
    createSubState<T extends object>(
      initialState: T & AllowedSubStateProperties<T>
    ): T & SubStateFlagWrapper
    
Creates a sub state object from initial state object.<br/>
This function adds a readonly \_\_isSubState\_\_ property to the initial state object.<br/>
Initial state may not contain key __isSubState\__, if it contains, an error will be thrown.
    
### combineSelectors

    export type State = { [key: string]: SubState };
    
    type SelectorsBase<T extends State> = {
      [key: string]: (state: T) => any;
    };
    
     type Selectors<T extends State, U extends SelectorsBase<T>> = {
      [K in keyof U]: (state: T) => ReturnType<U[K]>;
    };

    combineSelectors<T extends State, U1 extends SelectorsBase<T>, ... Un extends SelectorsBase<T>>(
      selectorsObject1: Selectors<T, U1>,
      ...
      selectorsObject2: Selectors<T, Un>
    ): Selectors<T, U1> & ... Selectors<T, Un>;
    
combines object of selectors to a single object containing all selectors.<br/>
It also checks for duplicate selector keys and throws an error if a duplicate key is found.

### createStore

    createStore<T extends State, U extends SelectorsBase<T>>(
      initialState: T,
      selectors: Selectors<T, U>
    ): Store<T, U>
    
creates a store containing initialState and selectors

### Store::getState
    type ReactiveState<T> = T extends Ref ? T : UnwrapRef<T>;
    
    class Store<T extends State, U extends SelectorsBase<T>> {
        getState(): ReactiveState<T>
    }
    
gets state from the store

### Store::getSelectors
    type ComputedSelectors<T extends State, U extends SelectorsBase<T>> = {
       [K in keyof U]: ComputedRef<ReturnType<U[K]>>;
    };
        
    class Store<T extends State, U extends SelectorsBase<T>> {
      getSelectors(): ComputedSelectors<T, U>
    }

gets selectors from the store
    
### Store::getStateAndSelectors
    class Store<T extends State, U extends SelectorsBase<T>> {
      getStateAndSelectors(): [ReactiveState<T>, ComputedSelectors<T, U>]
    }

gets state and selectors from the store
