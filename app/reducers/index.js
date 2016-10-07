import { combineReducers } from 'redux';
import byId, * as fromById from './byId';
import createList, * as fromList from './createList';


const listByFilter = combineReducers({
    all: createList('all'),
    active: createList('active'),
    completed: createList('completed')
});


const todos = combineReducers({
    byId,
    listByFilter
});

export default todos;


/************ pour obtenir un array de todos ************/
export const getVisibleTodos = (state, filter) => {
    const ids = fromList.getIds(state.listByFilter[filter]);    // fonction defini dans le reducer 'createList.js'

    return ids.map(id => {
        return fromById.getTodo(state.byId, id);                // fonction defini dans le reducer 'byId.js'
    });
};


/************ pour le loading ************/
export const getIsFetching = (state, filter) => {
    return fromList.getIsFetching(state.listByFilter[filter]); // fonction defini dans le reducer 'createList.js' qui retournera juste 'true / false'
};


/************ pour les erreurs ************/
export const getErrorMessage = (state, filter) => {
    return fromList.getErrorMessage(state.listByFilter[filter]);
};
