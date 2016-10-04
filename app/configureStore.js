import { createStore } from 'redux';
import todoApp from './reducers';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';

const configureStore = () => {
    const persistedState = loadState();
    const store = createStore(todoApp, persistedState);
    console.log(store.getState());

    // fonction appelé à chaque fois que l'etat du localstorage change - 'throttle' va résoudre le probleme de chargement tres répété :
    store.subscribe(throttle(() => {
        saveState({
            todos: store.getState().todos
        });
    }, 1000));

    return store;
};

export default configureStore;