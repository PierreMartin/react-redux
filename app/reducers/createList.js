import { combineReducers } from 'redux';


// cette méthode retournera l'id des todos en fonction du filtre :
const createList = (filter) => {
    const ids = (state = [], action) => {
        switch (action.type) {
            case 'FETCH_TODOS_SUCCESS':
                return filter === action.filter ? action.response.result : state;
            case 'ADD_TODO_SUCCESS':
                return filter !== 'completed' ? [...state, action.response.result] : state; // sans cette condition, les todos ajouté seraient visible même si le filtre est à 'completed'
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
