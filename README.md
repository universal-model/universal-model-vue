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
         
## State

### Initial state
initialTodoListState.ts

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

## App Store
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

## Service
ITodoService.ts

    import { Todo } from '@/todolist/model/state/initialTodoListState';
    
    export interface ITodoService {
      fetchTodos(): Promise<Todo[]>;
    }
    
FakeTodoService.ts
    
    import { ITodoService } from '@/todolist/model/services/ITodoService';
    import { Todo } from '@/todolist/model/state/initialTodoListState';
    import Constants from "@/Constants";
    
    export default class FakeTodoService implements ITodoService {
      fetchTodos(): Promise<Todo[]> {
        return new Promise<Todo[]>((resolve: (todo: Todo[]) => void) => {
          setTimeout(() => resolve([
            { name: 'first todo', isDone: true },
            { name: 'second todo', isDone: false }
          ]), Constants.FAKE_SERVICE_LATENCY_IN_MILLIS);
        });
      }
    }

todoService.ts

    import FakeTodoService from "@/todolist/model/services/FakeTodoService";
    
    export default new FakeTodoService();

## Actions
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
    
      todosState.isFetchingTodos = false;
      todosState.todos = await todoService.fetchTodos();
      todosState.isFetchingTodos = true;
    }
    
## Controller
todoListController.ts

    import addTodo from "@/todolist/model/actions/addTodo";
    import removeAllTodos from "@/todolist/model/actions/removeAllTodos";
    
    export default {
      handleKeyPress(keyboardEvent: KeyboardEvent): void {
        if (keyboardEvent.code === 'KeyA') {
          addTodo();
        } else if (keyboardEvent.code === 'KeyR') {
          removeAllTodos();
        }
      }
    };

    
## View
TodoListView.vue

    <template>
      <div>
        <input
          id="shouldShowOnlyUnDoneTodos"
          type="checkbox"
          :checked="todosState.shouldShowOnlyDoneTodos"
          @click="toggleShouldShowOnlyUnDoneTodos"
        />
        <label for="shouldShowOnlyUnDoneTodos">Show only undone todos</label>
        <ul>
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
        const [{ todosState }, { shownTodos }] = store.getStateAndSelectors();
    
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
          removeTodo,
          toggleShouldShowOnlyUnDoneTodos,
          toggleIsDoneTodo
        };
      }
    };
    </script>
    
    <style scoped></style>


