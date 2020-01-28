# Universal Model for Vue

Universal model is a model which can be used with any of following UI frameworks:
* Angular 2+ [universal-model-angular]
* React 16.8+ [universal-model-react]
* Svelte 3+ [universal-model-svelte]
* Vue.js 3+

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
* Selectors select and calculate a transformed version of state that causes view updates
* Views contain NO business logic
* There can be multiple interchangable views that use same part of model
* A new view can be created to represent model differently without any changes to model
    
## Clean UI Code directory layout

    - src
      |
      |- common
      |  |- component1
      |  |- component2
      |     |- component2_1
      |     .
      |     .
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
**Create and export store in store.ts:**
    
    const initialState = {
      componentAState: createSubState(initialComponentAState),
      
      componentBState: createSubState(initialComponentBState),
      componentB_1State: createSubState(initialComponentB_1State),
      component1ForComponentBState: createSubState(initialComponent1State),
      component2ForComponentBState: createSubState(initialComponent2State),
      .
      .
    };
    
    export type State = typeof initialState;
    
    const selectors = combineSelectors([
      createComponentAStateSelectors<State>(),
      createComponentBStateSelectors<State>(),
      createComponentB_1StateSelectors<State>(),
      createComponent1Selectors<State>('componentB');
      createComponent2Selectors<State>('componentB');
      .
      .
    ]);
    
    export default createStore(initialState, selectors);
    
in large projects you should have sub stores for components and these sub store are combined 
together to a single store in store.js:

componentBStore.js

    const componentBnitialState = { 
      componentBState: createSubState(initialComponentBState),
      componentB_1State: createSubState(initialComponentB_1State),
      component1ForComponentBState: createSubState(initialComponent1State),
      component2ForComponentBState: createSubState(initialComponent2State),  
    };
    
    const componentBSelectors = combineSelectors([
      createComponentBStateSelectors<State>(),
      createComponentB_1StateSelectors<State>(),
      createComponent1Selectors<State>('componentB');
      createComponent2Selectors<State>('componentB');
    ]);
    
store.js

    const initialState = {
       ...componentAInitialState,
       ...componentBInitialState,
       .
       .
       ...componentNInitialState
    };
          
    export type State = typeof initialState;
        
    const selectors = combineSelectors([
      componentASelectors,
      componentBSelectors,
      ...
      componentNSelectors
    ]);
        
    export default createStore(initialState, selectors);
    
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
          document.addEventListener('keypress', todoListController.handleKeyPress);
        });
    
        onUnmounted(() => {
          document.removeEventListener('keypress', todoListController.handleKeyPress);
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
      handleKeyPress(keyboardEvent: KeyboardEvent): void {
        if (keyboardEvent.code === 'KeyA' && keyboardEvent.ctrlKey) {
          addTodo();
        } else if (keyboardEvent.code === 'KeyR' && keyboardEvent.ctrlKey) {
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
    
    const selectors = combineSelectors([
      createTodoListStateSelectors<State>(),
      createHeaderStateSelectors<State>()
    ]);
    
    export default createStore(initialState, selectors);


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
          const unDoneTodoCount = state.todosState.todos.filter((todo: Todo) => !todo.isDone).length;
          const todoCount = state.todosState.todos.length;
          return `${state.headerState.userName} (${unDoneTodoCount}/${todoCount})`
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
        )
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
    
### Full Example
https://github.com/universal-model/universal-model-vue-todo-app

### License
MIT License

[universal-model-angular]: https://github.com/universal-model/universal-model-angular
[universal-model-react]: https://github.com/universal-model/universal-model-react
[universal-model-svelte]: https://github.com/universal-model/universal-model-svelte
