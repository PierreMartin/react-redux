import { getIsFetching } from '../reducers';
import * as api from '../api';


// fonction utilisé dans le composant 'VisibleTodoList.js' - sa valeur de retour est une fonction :
export const fetchTodos = (filter) => {
    return (dispatch, getState) => {                            // lié au 'thunk' dans configStore.js

        // fera QUE des 'REQUEST_TODOS' tant qu'on cliquera sans arret sur les filtres :
        if (getIsFetching(getState(), filter)) {
            return Promise.resolve();
        }

        // start fetching :
        dispatch({                                              // 1) async operation ('thunk' dans configStore.js)
            type: 'FETCH_TODOS_REQUEST',
            filter
        });

        // finish fetching :
        return api.fetchTodos(filter).then(
            // 1er param - success :
            response => {
                dispatch({                                      // 2) async operation ('thunk' dans configStore.js)
                    type: 'FETCH_TODOS_SUCCESS',
                    filter,
                    response
                })
            },
            // 2em param - error :
            error => {
                dispatch({
                    type: 'FETCH_TODOS_FAILURE',
                    filter,
                    message: error.message || 'something went wrong from server'
                });
            }
        );
    }
};

export const addTodo = (text) => {
    return (dispatch) => {
        return api.addTodo(text).then(
            // success :
            response => {
                dispatch({                                      // 2) async operation ('thunk' dans configStore.js)
                    type: 'ADD_TODO_SUCCESS',
                    response
                })
            }
        );
    }
};

export const toggleTodo = (id) => ({
    type: 'TOGGLE_TODO',
    id
});