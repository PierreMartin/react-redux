import { createStore } from 'redux';
import todoApp from './reducers';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';


const addLoggingToDispatch = (store) => {
    const rawDispatch = store.dispatch;

    if (!console.group) {
        return rawDispatch;
    }

    return (action) => {
        console.group(action.type);
        console.log('%c prev state', 'color: gray', store.getState());
        console.log('%c action', 'color: blue', action);
        const returnValue = rawDispatch(action);
        console.log('%c next state', 'color: green', store.getState());
        console.groupEnd(action.type);
        return returnValue;
    };
};

const configureStore = () => {
    const persistedState = loadState();
    const store = createStore(todoApp, persistedState);

    if (process.env.NODE_ENV !== 'production') {
        store.dispatch = addLoggingToDispatch(store);
    }

    // fonction appelé à chaque fois que l'etat du localstorage change - 'throttle' va résoudre le probleme de chargement tres répété :
    store.subscribe(throttle(() => {
        saveState({
            todos: store.getState().todos
        });
    }, 1000));

    return store;
};

export default configureStore;