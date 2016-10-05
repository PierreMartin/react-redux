import { combineReducers } from 'redux';
import todo from './todo';

/************ 'todos' reducer ************/
// Chaque fois qu'une action est faite sur un todo_, ce reducer renvoie un nouveau objet (liste des todos) contenant des objets (1 todo_) updaté :
const byId = (state = {}, action) => {
    switch (action.type) {
        // 'ADD_TODO' et 'TOGGLE_TODO' retourne la même chose
        case 'ADD_TODO':
        case 'TOGGLE_TODO':
            //console.log({...state, [action.id]: todo(state[action.id], action)});
            return {
                ...state,
                [action.id]: todo(state[action.id], action)
            };
        default:
            return state;
    }
};

// Chaque fois qu'un todo_ est ajouté, ce reducer renvoie un nouveau tableau avec l'ID du nouveau todo_ à la fin :
const allIds = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            //console.log([...state, action.id]);
            return [...state, action.id];
        default:
            return state;
    }
};


const todos = combineReducers({
    byId,
    allIds
});

export default todos;



/************ pour obtenir un array de todos ************/
const getAllTodos = (state) => (
    state.allIds.map((id) => {
        return state.byId[id];
    })
);

export const getVisibleTodos = (state, filter) => {
    const allTodos = getAllTodos(state);

    switch (filter) {
        case 'all':
            return allTodos;
        case 'completed':
            return allTodos.filter(t => t.completed);
        case 'active':
            return allTodos.filter(t => !t.completed);
        default:
            throw new Error(`Unknown filter: ${filter}.`);
    }
};
