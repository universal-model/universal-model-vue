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
      
## API
    const store = createStore(initialState, combineSelectors(selectors))
    const state = store.getState();
    const selectors = store.getSelectors();
    const [state, selectors] = store.getStateAndSelectors();
        
## API Examples
**Create and export store in store.ts:**
    
    const initialState = {
      componentAState: initialComponentAState,
      componentBState: initialComponentBState,
      .
      .
    };
    
    export type State = typeof initialState;
    
    const selectors = combineSelectors([
      createComponentAStateSelectors<State>(),
      createComponentBStateSelectors<State>(),
      .
      .
    ]);
    
    export default createStore(initialState, selectors);
    
**Access store in Actions**

    export default function changeComponentAStateProp1(newValue) {
      const { componentAState } = store.getState();
      componentAState.prop1 = newValue;
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
        changeComponentAStateProp1
      };
    }
            
# Example

## View
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
            <label :for="todo.name">{{ todo.name }}</label>
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

    import { combineSelectors, createStore } from 'universal-model-vue';
    import initialTodoListState from '@/todolist/model/state/initialTodoListState';
    import createTodoListStateSelectors from '@/todolist/model/state/createTodoListStateSelectors';
    
    const initialState = {
      todosState: initialTodosState,
      otherState: initialOtherState
    };
    
    export type State = typeof initialState;
    
    const selectors = combineSelectors([
      createTodosStateSelectors<State>(),
      createOtherStateSelectors<State>()
    ]);
    
    export default createStore(initialState, selectors);

### State

#### Initial state
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
