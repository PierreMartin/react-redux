import { combineReducers } from 'redux';
import { createStore } from 'redux';


/*************************** LES REDUCERS **************************/
const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                // On ajoute la new todos à l'item :
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }
            //
            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};


const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                // On récupere l'ancien item DANS notre nouvelle objet :
                ...state,
                todo(undefined, action)                                     // ICI L'APPEL FONCTION
            ];
        case 'TOGGLE_TODO':
            return stat.map(t => todo(t, action));                          // ICI L'APPEL FONCTION
        default:
            return state;
    }
};



const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};


// root reducer :
const todoApp = combineReducers({
    todos,
    visibilityFilter
});


/******************************* LE STORE *****************************/
const store = createStore(todoApp);


/*************************** LES COMPONANTS **************************/
const { Component } = React;

let nextTodoId = 0;
class TodoApp extends Component {
    render() {
        return (
            <div>
                
                <input ref={node => {
                  this.input = node; // node = "input"
                }} />

                <button onClick={() => {
                  store.dispatch({                  // Changement d'etat causé ici
                    type: 'ADD_TODO',
                    text: this.input.value,
                    id: nextTodoId++                // Chaque todo a besoin de son propre id
                  });
                  this.input.value = '';
                }}>
                    Ajouter une todos
                </button>

                <ul>
                    {this.props.todos.map(todo =>
                        <li key={todo.id}>
                            {todo.text}
                        </li>
                    )}
                </ul>

            </div>
        );
    }
}


// fonction qui va rendre les stats du store
const render = () => {
    ReactDOM.render(
        <TodoApp todos={store.getState().todos} />,
        document.getElementById('root')
    );
};

store.subscribe(render);
render();
