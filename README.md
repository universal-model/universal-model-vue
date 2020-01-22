# Universal Model for Vue

Universal model is a model which can be used with any of following UI frameworks:
* Angular 2+
* React 16.8+
* Svelte 3+
* Vue.js 3+

## Clean UI Architecture
![alt text](https://github.com/universal-model/universal-model-vue/raw/master/images/mvc.png "MVC")
* Model-View-Controller (https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
* User triggers actions by using view or controller
* Actions are part of model and they manipulate state that is stored
* Actions can use services to interact with external (backend) systems
* State changes trigger view updates
* Selectors select and calculate a transformed version of state that causes view updates
* Views contain NO business logic
* There can be multiple interchangable views that use same part of model
* A new view can be created to represent model differently without any changes to model

## Code directory layout

    - src
      |
      |- common
      |  |- component1
      |  |- component2
      |     .
      |     .
      |     .
      |- componentA
      |- componentB
      |  .
      |  .
      |  .
      |- componentN
      |  |- controller
      |  |- model
      |  |  |- actions
      |  |  |- services
      |  |  |- state
      |  |- view 
      |- store
         
##  Store

### Initial states
initialTodosState.ts

    export interface Todo {
      name: string;
      isDone: boolean;
    }
    
    export default {
      todos: [] as Todo[],
      shouldShowOnlyUnDoneTodos: false,
      isFetchingTodos: false
    };

### State selectors
createTodosStateSelectors.ts

    import { State } from '@/store/store';
    import { Todo } from '@/todolist/model/state/initialTodoListState';
    
    const createTodoListStateSelectors = <T extends State>() => ({
      shownTodos: (state: T) =>
        state.todosState.todos.filter(
          (todo: Todo) =>
            (state.todosState.shouldShowOnlyUnDoneTodos && !todo.isDone) ||
            !state.todosState.shouldShowOnlyUnDoneTodos
        )
    });
    
    export default createTodoListStateSelectors;

### Store
store.ts

    import { createStore } from 'universal-model-vue';
    import initialTodoListState from '@/todolist/model/state/initialTodoListState';
    import createTodoListStateSelectors from '@/todolist/model/state/createTodoListStateSelectors';
    
    const initialState = {
      todosState: initialTodosState,
      otherState: initialOtherState,
      .
      .
    };
    
    export type State = typeof initialState;
    
    const selectors = {
      ...createTodosStateSelectors<State>(),
      ...createOtherStateSelectors<State>(),
      .
      .
      
    };
    
    export default createStore(initialState, selectors);
