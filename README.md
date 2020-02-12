# Universal Model for Vue

[![version][version-badge]][package]
[![Downloads][Downloads]][package]
[![build][build]][circleci]
[![MIT License][license-badge]][license]
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Funiversal-model%2Funiversal-model-vue.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Funiversal-model%2Funiversal-model-vue?ref=badge_shield)

Universal model is a model which can be used with any of following UI frameworks:
* Angular 2+ [universal-model-angular]
* React 16.8+ [universal-model-react]
* Svelte 3+ [universal-model-svelte]
* Vue.js 3+

If you want to use multiple UI frameworks at the same time, you can use single model
with [universal-model] library

## Install

    npm install --save universal-model-vue

## Prerequisites for universal-model-vue

     "vue": "^3.0.0-alpha.1"
     
## Clean UI Architecture
![alt text](https://github.com/universal-model/universal-model-vue/raw/master/images/mvc.png "MVC")
* Model-View-Controller (https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
* User triggers actions by using view or controller
* Actions are part of model and they manipulate state that is stored
* Actions can use services to interact with external (backend) systems
* State changes trigger view updates
* Selectors select part of state and optionally calculate a transformed version of state that causes view updates
* Views contain NO business logic
* There can be multiple interchangeable views that use same part of model
* A new view can be created to represent model differently without any changes to model
* View technology can be changed without changes to the model
    
## Clean UI Code directory layout
UI application is divided into UI components. Common UI components should be put into common directory. Each component
can consist of subcomponents. Each component has a view and optionally controller and model. Model consists of actions, state
and selectors. In large scale apps, model can contain sub-store. Application has one store which is composed of each components'
state (or sub-stores)

    - src
      |
      |- common
      |  |- component1
      |  |- component2
      |  .  |- component2_1
      |  .  .
      |  .  .
      |  .
      |- componentA
      |- componentB
      |  |- componentB_1
      |  |- componentB_2
      |- componentC
      |- |- view
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
      
## API
    createSubState(subState);
    const store = createStore(initialState, combineSelectors(selectors));
    
    const { componentAState } = store.getState();
    const { selector1, selector2 } = store.getSelectors();
    const [{ componentAState }, { selector1, selector2 }] = store.getStateAndSelectors();
        
## API Examples
**Create initial states**

    const initialComponentAState = {
      prop1: 0,
      prop2: 0
    };
    
**Create selectors**

When using foreign state inside selectors, prefer creating foreign state selectors and accessing foreign
state through them instead of directly accessing foreign state inside selector. This will ensure  better
encapsulation of component state.

    const createComponentASelectors = <T extends State>() => ({
      selector1: (state: State) => state.componentAState.prop1  + state.componentAState.prop2
      selector2: (state: State) => {
        const { componentBSelector1, componentBSelector2 } = createComponentBSelectors<State>();
        return state.componentAState.prop1 + componentBSelector1(state) + componentBSelector2(state);
      }
    });
    
**Create and export store in store.ts:**

combineSelectors() checks if there are duplicate keys in selectors and will throw an error telling which key was duplicated.
By using combineSelectors you can keep your selector names short and only namespace them if needed.
    
    const initialState = {
      componentAState: createSubState(initialComponentAState),
      componentBState: createSubState(initialComponentBState)
    };
    
    export type State = typeof initialState;
    
    const componentAStateSelectors = createComponentAStateSelectors<State>();
    const componentBStateSelectors = createComponentBStateSelectors<State>();
    
    const selectors = combineSelectors<State, typeof componentAStateSelectors, typeof componentBStateSelectors>(
      componentAStateSelectors,
      componentBStateSelectors
    );
    
    export default createStore<State, typeof selectors>(initialState, selectors);
    
in large projects you should have sub stores for components and these sub store are combined 
together to a single store in store.js:

**componentBStore.js**

    const componentBInitialState = { 
      componentBState: createSubState(initialComponentBState),
      componentB_1State: createSubState(initialComponentB_1State),
      component1ForComponentBState: createSubState(initialComponent1State) 
    };
    
    const componentBStateSelectors = createComponentBStateSelectors<State>();
    const componentB_1StateSelectors = createComponentB_1StateSelectors<State>();
    const component1ForComponentBSelectors = createComponent1Selectors<State>('componentB');
    
    const componentBSelectors = combineSelectors<State, typeof componentBStateSelectors, typeof componentB_1StateSelectors, typeof component1ForComponentBSelectors>(
      componentBStateSelectors,
      componentB_1StateSelectors,
      component1ForComponentBSelectors
    );
    
**store.js**

    const initialState = {
      ...componentAInitialState,
      ...componentBInitialState,
      .
      ...componentNInitialState
    };
          
    export type State = typeof initialState;
        
    const selectors = combineSelectors<State, typeof componentASelectors, typeof componentBSelectors, ... typeof componentNSelectors>(
      componentASelectors,
      componentBSelectors,
      .
      componentNSelectors
    );
        
    export default createStore<State, typeof selectors>(initialState, selectors);
    
**Access store in Actions**

Don't modify other component's state directly inside action, but instead 
call other component's action. This will ensure encapsulation of component's own state.

    export default function changeComponentAAndBState(newAValue, newBValue) {
      const { componentAState } = store.getState();
      componentAState.prop1 = newAValue;
      
      // BAD
      const { componentBState } = store.getState();
      componentBState.prop1 = newBValue;
      
      // GOOD
      changeComponentBState(newBValue);
    }
    
**Use actions, state and selectors in View**

Components should use only their own state and access other components' states using selectors
provided by those components. This will ensure encapsulation of each component's state.

    export default {
      setup(): object {
        const [ { componentAState }, { selector1, selector2 }] = store.getStateAndSelectors();
      
      return {
        componentAState,
        selector1,
        selector2,
        // Action
        changeComponentAState
      };
    }
            
# Example

## View

App.vue

    <template>
      <div>
        <HeaderView />
        <TodoListView />
      </div>
    </template>
    
    <script lang="ts">
    import HeaderView from '@/header/view/HeaderView.vue';
    import TodoListView from '@/todolist/view/TodoListView.vue';
    
    // noinspection JSUnusedGlobalSymbols
    export default {
      name: 'App',
      components: { HeaderView, TodoListView }
    };
    </script>
    
    <style scoped></style>

HeaderView.vue

    <template>
      <div>
        <h1>{{ headerText }}</h1>
        <label for="userName">User name:</label>
        <input id="userName" @change="({ target: { value } }) => changeUserName(value)" />
      </div>
    </template>
    
    <script lang="ts">
    import store from '@/store/store';
    import changeUserName from '@/header/model/actions/changeUserName';
    
    export default {
      name: 'HeaderView',
    
      setup(): object {
        const { headerText } = store.getSelectors();
    
        return {
          headerText,
          changeUserName
        };
      }
    };
    </script>
    
    <style scoped></style>


TodoListView.vue

    <template>
      <div>
        <input
          id="shouldShowOnlyUnDoneTodos"
          type="checkbox"
          :checked="todosState.shouldShowOnlyUnDoneTodos"
          @click="toggleShouldShowOnlyUnDoneTodos"
        />
        <label for="shouldShowOnlyUnDoneTodos">Show only undone todos</label>
        <div v-if="todosState.isFetchingTodos">Fetching todos...</div>
        <div v-else-if="todosState.hasTodosFetchFailure">Failed to fetch todos</div>
        <ul v-else>
          <li v-for="todo in shownTodos">
            <input :id="todo.name" type="checkbox" :checked="todo.isDone" @click="toggleIsDoneTodo(todo)" />
            <label :for="todo.name">{{ userName }}: {{ todo.name }}</label>
            <button @click="removeTodo(todo)">Remove</button>
          </li>
        </ul>
      </div>
    </template>
    
    <script lang="ts">
    import { onMounted, onUnmounted } from 'vue';
    import store from '@/store/store';
    import toggleShouldShowOnlyUnDoneTodos from '@/todolist/model/actions/toggleShouldShowOnlyUnDoneTodos';
    import removeTodo from '@/todolist/model/actions/removeTodo';
    import toggleIsDoneTodo from '@/todolist/model/actions/toggleIsDoneTodo';
    import fetchTodos from '@/todolist/model/actions/fetchTodos';
    import todoListController from '@/todolist/controller/todoListController';
    
    export default {
      setup(): object {
        const [{ todosState }, { shownTodos, userName }] = store.getStateAndSelectors();
    
        onMounted(() => {
          fetchTodos();
          document.addEventListener('keydown', todoListController.handleKeyDown);
        });
    
        onUnmounted(() => {
          document.removeEventListener('keydown', todoListController.handleKeyDown);
        });
    
        return {
          todosState,
          shownTodos,
          userName,
          removeTodo,
          toggleShouldShowOnlyUnDoneTodos,
          toggleIsDoneTodo
        };
      }
    };
    </script>
    
    <style scoped></style>
    
## Controller
todoListController.ts

    import addTodo from "@/todolist/model/actions/addTodo";
    import removeAllTodos from "@/todolist/model/actions/removeAllTodos";
    
    export default {
      handleKeyDown(keyboardEvent: KeyboardEvent): void {
        if (keyboardEvent.code === 'KeyA' && keyboardEvent.ctrlKey) {
          keyboardEvent.stopPropagation();
          keyboardEvent.preventDefault();
          addTodo();
        } else if (keyboardEvent.code === 'KeyR' && keyboardEvent.ctrlKey) {
          keyboardEvent.stopPropagation();
          keyboardEvent.preventDefault();
          removeAllTodos();
        }
      }
    };

## Model

### Store
store.ts

    import { combineSelectors, createStore, createSubState } from 'universal-model-vue';
    import initialHeaderState from '@/header/model/state/initialHeaderState';
    import initialTodoListState from '@/todolist/model/state/initialTodoListState';
    import createTodoListStateSelectors from '@/todolist/model/state/createTodoListStateSelectors';
    import createHeaderStateSelectors from '@/header/model/state/createHeaderStateSelectors';
    
    const initialState = {
      headerState: createSubState(initialHeaderState),
      todosState: createSubState(initialTodoListState)
    };
    
    export type State = typeof initialState;
    
    const headerStateSelectors =  createHeaderStateSelectors<State>();
    const todoListStateSelectors = createTodoListStateSelectors<State>();
    
    const selectors = combineSelectors<State, typeof headerStateSelectors, typeof todoListStateSelectors>(
     headerStateSelectors,
     todoListStateSelectors 
    );
    
    export default createStore<State, typeof selectors>(initialState, selectors);

### State

#### Initial state
initialHeaderState.ts

    export default {
      userName: 'John'
    };

initialTodoListState.ts

    export interface Todo {
      name: string;
      isDone: boolean;
    }
    
    export default {
      todos: [] as Todo[],
      shouldShowOnlyUnDoneTodos: false,
      isFetchingTodos: false,
      hasTodosFetchFailure: false
    };

#### State selectors
createHeaderStateSelectors.ts

    import { State } from '@/store/store';
    
    const createHeaderStateSelectors = <T extends State>() => ({
      userName: (state: T) => state.headerState.userName,
      headerText: (state: T) => {
        const {
          todoCount: selectTodoCount,
          unDoneTodoCount: selectUnDoneTodoCount
        } = createTodoListStateSelectors<T>();
      
        return `${state.headerState.userName} (${selectUnDoneTodoCount(state)}/${selectTodoCount(state)})`;
      }
    });
    
    export default createHeaderStateSelectors;


createTodoListStateSelectors.ts

    import { State } from '@/store/store';
    import { Todo } from '@/todolist/model/state/initialTodoListState';
    
    const createTodoListStateSelectors = <T extends State>() => ({
      shownTodos: (state: T) =>
        state.todosState.todos.filter(
          (todo: Todo) =>
            (state.todosState.shouldShowOnlyUnDoneTodos && !todo.isDone) ||
            !state.todosState.shouldShowOnlyUnDoneTodos
        ),
      todoCount: (state: T) => state.todosState.todos.length,
      unDoneTodoCount: (state: T) => state.todosState.todos.filter((todo: Todo) => !todo.isDone).length
    });
    
    export default createTodoListStateSelectors;
    
### Service
ITodoService.ts

    import { Todo } from '@/todolist/model/state/initialTodoListState';
    
    export interface ITodoService {
      tryFetchTodos(): Promise<Todo[]>;
    }
    
FakeTodoService.ts
    
    import { ITodoService } from '@/todolist/model/services/ITodoService';
    import { Todo } from '@/todolist/model/state/initialTodoListState';
    import Constants from "@/Constants";
    
    export default class FakeTodoService implements ITodoService {
      tryFetchTodos(): Promise<Todo[]> {
          return new Promise<Todo[]>((resolve: (todo: Todo[]) => void, reject: () => void) => {
            setTimeout(() => {
              if (Math.random() < 0.95) {
                resolve([
                  { name: 'first todo', isDone: true },
                  { name: 'second todo', isDone: false }
                ]);
              } else {
                reject();
              }
            }, Constants.FAKE_SERVICE_LATENCY_IN_MILLIS);
          });
        }
    }

todoService.ts

    import FakeTodoService from "@/todolist/model/services/FakeTodoService";
    
    export default new FakeTodoService();

### Actions
changeUserName.ts

    import store from "@/store/store";
    
    export default function changeUserName(newUserName: string): void {
      const { headerState } = store.getState();
      headerState.userName = newUserName;
    }


addTodo.ts
    
    import store from '@/store/store';
    
    export default function addTodo(): void {
      const { todosState } = store.getState();
      todosState.todos.push({ name: 'new todo', isDone: false });
    }
    
removeTodo.ts

    import store from '@/store/store';
    import { Todo } from '@/todolist/model/state/initialTodoListState';
    
    export default function removeTodo(todoToRemove: Todo): void {
      const { todosState } = store.getState();
      todosState.todos = todosState.todos.filter((todo: Todo) => todo !== todoToRemove);
    }
    
removeAllTodos.ts

    import store from '@/store/store';
    
    export default function removeAllTodos(): void {
      const { todosState } = store.getState();
      todosState.todos = [];
    }
    
toggleIsDoneTodo.ts

    import { Todo } from '@/todolist/model/state/initialTodoListState';
    
    export default function toggleIsDoneTodo(todo: Todo): void {
      todo.isDone = !todo.isDone;
    }
    
toggleShouldShowOnlyUnDoneTodos.ts

    import store from '@/store/store';
    
    export default function toggleShouldShowOnlyUnDoneTodos(): void {
      const [{ todosState }] = store.getStateAndSelectors();
      todosState.shouldShowOnlyUnDoneTodos = !todosState.shouldShowOnlyUnDoneTodos;
    }
    
fetchTodos.ts

    import store from '@/store/store';
    import todoService from '@/todolist/model/services/todoService';
    
    export default async function fetchTodos(): Promise<void> {
      const { todosState } = store.getState();
    
      todosState.isFetchingTodos = true;
      todosState.hasTodosFetchFailure = false;
        
      try {
        todosState.todos = await todoService.tryFetchTodos();
      } catch (error) {
        todosState.hasTodosFetchFailure = true;
      }
        
      todosState.isFetchingTodos = false;
    }
    
### Full Examples

https://github.com/universal-model/universal-model-vue-todo-app

https://github.com/universal-model/universal-model-react-todos-and-notes-app

### Dependency injection
If you would like to use dependency injection (noicejs) in your app, check out this [example],
where DI is used to create services.

### License
MIT License

[license-badge]: https://img.shields.io/badge/license-MIT-green
[license]: https://github.com/universal-model/universal-model-vue/blob/master/LICENSE
[version-badge]: https://img.shields.io/npm/v/universal-model-vue.svg?style=flat-square
[package]: https://www.npmjs.com/package/universal-model-vue
[build]: https://img.shields.io/circleci/project/github/universal-model/universal-model-vue/master.svg?style=flat-square
[circleci]: https://circleci.com/gh/universal-model/universal-model-vue/tree/master
[Downloads]: https://img.shields.io/npm/dm/universal-model-vue
[example]: https://github.com/universal-model/react-todo-app-with-dependency-injection
[universal-model]: https://github.com/universal-model/universal-model
[universal-model-angular]: https://github.com/universal-model/universal-model-angular
[universal-model-react]: https://github.com/universal-model/universal-model-react
[universal-model-svelte]: https://github.com/universal-model/universal-model-svelte
