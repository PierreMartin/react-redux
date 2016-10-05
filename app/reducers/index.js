import { combineReducers } from 'redux';
import todos, * as fromTodos from './todos';  // reducers

const todoApp = combineReducers({
    todos
});

export default todoApp;


// chargement des autres fonctions :
export const getVisibleTodos = (state, filter) => (
    fromTodos.getVisibleTodos(state.todos, filter)
);