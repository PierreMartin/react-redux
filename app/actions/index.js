import { v4 } from 'node-uuid';
// let nextTodoId = 0; // remplacé par 'node-uuid'

import * as api from '../api';

const receiveTodos = (filter, response) => ({
    type: 'RECEIVE_TODO',
    filter,
    response
});

export const fetchTodos = (filter) => {
    return api.fetchTodos(filter).then(response =>
        receiveTodos(filter, response)
    );
};

export const addTodo = (text) => ({
    type: 'ADD_TODO',
    //id: (nextTodoId++).toString(),
    id: v4(),
    text
});

export const toggleTodo = (id) => ({
    type: 'TOGGLE_TODO',
    id
});