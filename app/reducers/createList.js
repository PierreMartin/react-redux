import { combineReducers } from 'redux';


// cette méthode retournera l'id des todos en fonction du filtre :
const createList = (filter) => {

    const handleToggle = (state, action) => {
        const { result: toggledId, entities } = action.response;
        const { completed } = entities.todos[toggledId];                // { completed } = action.response.entities.todos[action.response.result].completed     // la valeur 'completed' du todo_ cliqué

        const shouldRemove = (
            (completed === true && filter === 'active') || (completed === false && filter === 'completed')
        );

        return shouldRemove ? state.filter(id => id !== toggledId) : state; // on fait disparaitre la todo_ car on retourne un nouveau state
    };

    const ids = (state = [], action) => {
        switch (action.type) {
            case 'FETCH_TODOS_SUCCESS':
                return filter === action.filter ? action.response.result : state;
            case 'ADD_TODO_SUCCESS':
                return filter !== 'completed' ? [...state, action.response.result] : state; // sans cette condition, les todos ajouté seraient visible quand le filtre est à 'completed'
            case 'TOGGLE_TODO_SUCCESS':
                return handleToggle(state, action);                                         // sans cette fonction, les todos togglé seraient toujours visible tant qu'on ne change pas le filtre
            default:
                return state;
        }
    };

    const isFetching = (state = false, action) => {
        if (action.filter !== filter) {
            return state;
        }

        switch (action.type) {
            case 'FETCH_TODOS_REQUEST':
                return true;
            case 'FETCH_TODOS_SUCCESS':
            case 'FETCH_TODOS_FAILURE':
                return false;   // false : on arrete le loading
            default:
                return state;
        }
    };

    const errorMessage = (state = null, action) => {
        if (action.filter !== filter) {
            return state;
        }

        switch (action.type) {
            case 'FETCH_TODOS_FAILURE':
                return action.message;
            case 'FETCH_TODOS_REQUEST':
            case 'FETCH_TODOS_SUCCESS':
                return null;
            default:
                return state;
        }
    };

    return combineReducers({
        ids,
        isFetching,
        errorMessage
    })

};

export default createList;
export const getIds = (state) => state.ids;
export const getIsFetching = (state) => state.isFetching;
export const getErrorMessage = (state) => state.errorMessage;
