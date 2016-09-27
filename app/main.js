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
                return state; // chaque todos dont l'id ne correspond pas à l'ID spécifié dans l'action, on renvoie juste l'état précédent
            }

            return {
                ...state,                           // on recupere les propriétés du todo original
                completed: !state.completed         // cette propriété aura une valeur inverse de l'original
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
            return state.map(t =>
                todo(t, action)                                             // ICI L'APPEL FONCTION
            );
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


/*************************** FUNCTIONS **************************/
const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(
                t => t.completed    // retourne tout les elements du tableau dont la propriété "completed" est à 'true'
            );
        case 'SHOW_ACTIVE':
            return todos.filter(
                t => !t.completed   // retourne tout les elements du tableau dont la propriété "completed" est à 'false'
            );
    }
};

/*************************** LES COMPONANTS **************************/
const { Component } = React;
let nextTodoId      = 0;


const FilterLink = ({filter, currentFilter, children}) => {
    if (filter === currentFilter) {
        return <span>{children}</span>; // permet de supprimer le lien lorque l'on a cliqué dessus
    }

    return (
        <a
            href='#'
            onClick={e => {
                e.preventDefault();
                store.dispatch({
                    type: 'SET_VISIBILITY_FILTER',
                    filter
                })
            }}
        >
            {children}
        </a>
    );
};



class TodoApp extends Component {
    render() {
        // FILTER :
        // const visibleTodos = getVisibleTodos(this.props.todos, this.props.visibilityFilter);
        const { todos, visibilityFilter } = this.props;
        const visibleTodos = getVisibleTodos(todos, visibilityFilter);

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
                    {visibleTodos.map(todo =>
                        <li
                            key={todo.id}
                            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}

                            onClick={ () => {
                              store.dispatch({
                                type: 'TOGGLE_TODO',
                                id: todo.id
                              });
                            }}
                        >

                            {todo.text}
                        </li>
                    )}
                </ul>

                {/*********** FILTER  ***********/}
                <p>
                    Show :

                    {' '}
                    <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter}> {/* this.props.visibilityFilter */}
                        all
                    </FilterLink>

                    {' '}
                    <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter}>
                        active
                    </FilterLink>

                    {' '}
                    <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter}>
                        completed
                    </FilterLink>

                </p>

            </div>
        );
    }
}


// fonction qui va rendre les stats du store
const render = () => {
    ReactDOM.render(
        <TodoApp {...store.getState()} />, // chaque state est passé comme 'props'  => this.props.todos + this.props.visibilityFilter
        document.getElementById('root')
    );
};

store.subscribe(render);
render();
