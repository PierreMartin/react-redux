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

/**** Todos ****/
const Todo = ({onClick, completed, text}) => (
    <li
        style={{ textDecoration: completed ? 'line-through' : 'none' }}
        onClick={onClick}
    >
        {text}
    </li>
);


const TodoList = ({todos, onTodoClick}) => (
    <ul>
        {todos.map(todo =>
            <Todo
                key={todo.id}       /* key unique pour les elements html */
                {...todo}           /* chaque propriété de 'todo' sera passé comme 'props'  => this.props.completed + this.props.text */
                onClick={() => onTodoClick(todo.id)}
            />
        )}
    </ul>
);


/**** Add todo1 ****/
const AddTodo = ({onAddClick}) => {
    let input;

    return (
        <div>
            <input ref={node => {
                  input = node; // node = "input"
                }} />

            <button onClick={() => {
                  onAddClick(input.value);
                  input.value = '';
                }}>
                Ajouter une todos
            </button>
        </div>
    );
};


/**** Filter todos ****/
const FilterLink = ({filter, currentFilter, children, onClick}) => {
    if (filter === currentFilter) {
        return <span>{children}</span>; // permet de supprimer le lien lorque l'on a cliqué dessus
    }

    return (
        <a
            href='#'
            onClick={e => {
                e.preventDefault();
                onClick(filter);
            }}
        >
            {children}
        </a>
    );
};

const Footer = ({visibilityFilter, onFilterClick}) => (
    <p>
        Show :

        {' '}
        <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter} onClick={onFilterClick}> {/* this.props.visibilityFilter */}
            all
        </FilterLink>

        {' '}
        <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter} onClick={onFilterClick}>
            active
        </FilterLink>

        {' '}
        <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter} onClick={onFilterClick}>
            completed
        </FilterLink>

    </p>
);


/**** TOP LEVEL COMPONANT ****/
const TodoApp = ({todos, visibilityFilter}) => (
        <div>

            {/*********** ADD TODO ***********/}
            <AddTodo
                onAddClick={text =>
                    store.dispatch({
                        type: 'ADD_TODO',
                        id: nextTodoId++,
                        text
                    })
                }
            />


            {/*********** LIST TODO ***********/}
            <TodoList
                todos={getVisibleTodos(todos, visibilityFilter)}
                onTodoClick={id =>
                    store.dispatch ({
                        type: 'TOGGLE_TODO',
                        id
                    })
                }
            />


            {/*********** FILTER  ***********/}
            <Footer
                visibilityFilter={visibilityFilter}     /* désactive le lien si deja cliqué */
                onFilterClick={filter =>                /* à chaque clique, on dispatch une action */
                    store.dispatch({
                      type: 'SET_VISIBILITY_FILTER',
                      filter
                    })
                }
            />

        </div>


);


// fonction qui va rendre les stats du store
const render = () => {
    ReactDOM.render(
        <TodoApp {...store.getState()} />, // chaque state est passé comme 'props'  => this.props.todos + this.props.visibilityFilter
        document.getElementById('root')
    );
};

store.subscribe(render);
render();
