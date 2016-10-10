import { normalize } from 'normalizr';          // normalizing API Responses
import * as schema from './schema';             // normalizing API Responses
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
                // console.log( 'normalize response : ', normalize(response, schema.arrayOfTodos) );
                dispatch({                                      // 2) async operation ('thunk' dans configStore.js) la reponse va être utilisé dans les reducers en faisant 'action.response.result...'
                    type: 'FETCH_TODOS_SUCCESS',
                    filter,
                    response: normalize(response, schema.arrayOfTodos)
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
                // console.log( 'normalize response : ', normalize(response, schema.todo) );
                dispatch({                                      // 2) async operation ('thunk' dans configStore.js) la reponse va être utilisé dans les reducers en faisant 'action.response.result...'
                    type: 'ADD_TODO_SUCCESS',
                    response: normalize(response, schema.todo)
                })
            }
        );
    }
};

export const toggleTodo = (id) => {
    return (dispatch) => {
        return api.toggleTodo(id).then(
            // success :
            response => {
                // console.log( 'normalize response : ', normalize(response, schema.todo) );
                dispatch({                                      // 2) async operation ('thunk' dans configStore.js) la reponse va être utilisé dans les reducers en faisant 'action.response.result...'
                    type: 'TOGGLE_TODO_SUCCESS',
                    response: normalize(response, schema.todo)
                })
            }
        );
    }
};
