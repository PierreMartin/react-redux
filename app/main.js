import { combineReducers } from 'redux';
const { Component } = React;


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
let nextTodoId = 0;

/**** Todos
 *
 * ****/
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


// Composant containeur
const mapStateToTodoListProps = (state) => {
    /* retourne un props de donné passé a travers 'TodoList' */
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    };
};

// Composant containeur
const mapDispatchToTodoListProps = (dispatch) => {
    /* retourne un props d'action passé a travers 'TodoList' */
    return {
        onTodoClick: (id) => {
            dispatch({
                type: 'TOGGLE_TODO',
                id
            })
        }
    };
};

import { connect } from 'react-redux'
const VisibleTodoList = connect(mapStateToTodoListProps, mapDispatchToTodoListProps)(TodoList); // TodoList => presentational component



/**** Add todos
 *
 *  ****/
let AddTodoCompo = ({ dispatch }) => {
    let input;

    return (
        <div>
            <input ref={node => {
                    input = node; // node = "input"
                }}
            />

            <button
                onClick={() => {
                    dispatch({
                      type: 'ADD_TODO',
                      id: nextTodoId++,
                      text: input.value
                    })
                    input.value = '';
                }}
            >
                Ajouter une todos
            </button>
        </div>
    );
};

const AddTodo = connect(null, null)(AddTodoCompo); // AddTodoCompo => presentational component


/**** Filter todos
 *
 * ****/
const Link = ({active, children, onClick}) => {
    if (active) {
        return <span>{children}</span>;
    }

    return (
        <a
            href='#'
            onClick={e => {
                e.preventDefault();
                onClick();
            }}
        >
            {children}
        </a>
    );
};

// Composant containeur
const mapStateToLinkProps = (state, ownProps) => {
    /* retourne un props de donné passé a travers 'Link' */
    return {
        active : ownProps.filter === state.visibilityFilter
    }
};

// Composant containeur
const mapDispatchToLinkProps = (dispatch, ownProps) => {
    /* retourne un props d'action passé a travers 'Link' */
    return {
        onClick: () => {
            dispatch({
                type: 'SET_VISIBILITY_FILTER',
                filter: ownProps.filter
            })
        }
    }
};

const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link); // Link => presentational component



const Footer = () => (
    <p>
        Show :

        {' '}
        <FilterLink filter='SHOW_ALL'>
            all
        </FilterLink>

        {' '}
        <FilterLink filter='SHOW_ACTIVE'>
            active
        </FilterLink>

        {' '}
        <FilterLink filter='SHOW_COMPLETED'>
            completed
        </FilterLink>

    </p>
);


/**** TOP LEVEL COMPONANT ****/
const TodoApp = ({ store }) => (
        <div>
            {/* Les Composant containeur (sauf pour le Footer) : */}
            <AddTodo />
            <VisibleTodoList />
            <Footer />
        </div>
);


/******************************* Context React (permet aux composants d'avoir accès au store) *****************************/
import { Provider } from 'react-redux';

Provider.childContextTypes = {
    store: React.PropTypes.object
};


/******************************* LE STORE *****************************/
import { createStore } from 'redux';


/******************************* RENDER TOP LEVEL *****************************/
const render = () => {
    ReactDOM.render(
        <Provider store={createStore(todoApp)}>
            <TodoApp />
        </Provider>,
        document.getElementById('root')
    );
};

// store.subscribe(render);
render();
