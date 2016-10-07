import { v4 } from 'node-uuid';
import { getIsFetching } from '../reducers';
import * as api from '../api';

// start fetching :
const requestTodos = (filter) => ({
    type: 'REQUEST_TODOS',
    filter
});

// finish fetching :
const receiveTodos = (filter, response) => ({
    type: 'RECEIVE_TODOS',
    filter,
    response
});

// fonction utilisé dans le composant 'VisibleTodoList.js' - sa valeur de retour est une fonction :
export const fetchTodos = (filter) => {
    return (dispatch, getState) => {                            // lié au 'thunk' dans configStore.js

        // fera QUE des 'REQUEST_TODOS' tant qu'on cliquera sans arret sur les filtres :
        if (getIsFetching(getState(), filter)) {
            return Promise.resolve();
        }

        dispatch(requestTodos((filter)));                       // 1) async operation ('thunk' dans configStore.js)

        return api.fetchTodos(filter).then(response =>
            dispatch(receiveTodos(filter, response))            // 2) async operation ('thunk' dans configStore.js)
        );
    }
};

export const addTodo = (text) => ({
    type: 'ADD_TODO',
    id: v4(),
    text
});

export const toggleTodo = (id) => ({
    type: 'TOGGLE_TODO',
    id
});