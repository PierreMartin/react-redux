import { combineReducers } from 'redux';



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

class VisibleTodoList extends Component {
    componentDidMount() {
        const { store } = this.props;
        this.unsubscribe = store.subscribe(() =>    /* rend le state dispatché */
            this.forceUpdate()                      /* methode react pour forcer le rendu à nouveau */
        );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const props = this.props;
        const { store } = props;
        const state = store.getState();

        return (
            <TodoList
                todos={ getVisibleTodos(state.todos, state.visibilityFilter) }
                onTodoClick={id =>
                    store.dispatch({
                        type: 'TOGGLE_TODO',
                        id
                    })
                }
            />
        );
    }
}


/**** Add todos ****/
const AddTodo = ({ store }) => {
    let input;

    return (
        <div>
            <input ref={node => {
                    input = node; // node = "input"
                }}
            />

            <button
                onClick={() => {
                    store.dispatch({
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


/**** Filter todos ****/
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


// Composant conteneur. Il fournit les données (sans passer par le parent) et le comportement pour "Link"
class FilterLink extends Component {
    componentDidMount() {
        const { store } = this.props;
        this.unsubscribe = store.subscribe(() =>    /* rend le state dispatché */
            this.forceUpdate()                      /* methode react pour forcer le rendu à nouveau */
        );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const props = this.props;
        const { store } = props;
        const state = store.getState();

        return (
            <Link
                active={props.filter === state.visibilityFilter}
                onClick={() =>
                    store.dispatch({
                        type: 'SET_VISIBILITY_FILTER',
                        filter: props.filter
                    })
                }
            >
                {props.children}
            </Link>
        );
    }
}


const Footer = ({ store }) => (
    <p>
        Show :

        {' '}
        <FilterLink filter='SHOW_ALL' store={store}>
            all
        </FilterLink>

        {' '}
        <FilterLink filter='SHOW_ACTIVE' store={store}>
            active
        </FilterLink>

        {' '}
        <FilterLink filter='SHOW_COMPLETED' store={store}>
            completed
        </FilterLink>

    </p>
);


/**** TOP LEVEL COMPONANT ****/
const TodoApp = ({ store }) => (
        <div>
            {/* Les componants comtainers : */}
            <AddTodo store={store} />
            <VisibleTodoList store={store} />
            <Footer store={store} />
        </div>
);



/******************************* LE STORE *****************************/
import { createStore } from 'redux';


// fonction qui va rendre les stats du store
const render = () => {
    ReactDOM.render(
        <TodoApp store={createStore(todoApp)} />, // chaque state est passé comme 'props'  => this.props.todos + this.props.visibilityFilter
        document.getElementById('root')
    );
};

// store.subscribe(render);
render();
