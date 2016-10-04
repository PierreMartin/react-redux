import { v4 } from 'node-uuid';
// let nextTodoId = 0; // remplacé par 'node-uuid'

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