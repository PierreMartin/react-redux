// fichier qui permet de normaliser les réponses de l'API pour avoir la même forme
import { Schema, arrayOf } from 'normalizr';

export const todo = new Schema('todos');
export const arrayOfTodos = arrayOf(todo);
