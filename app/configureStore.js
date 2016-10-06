import { createStore } from 'redux';
import todoApp from './reducers';

// 1 middleware :
const logger = (store) => {
    return (next) => {

        if (!console.group) {
            return next;
        }

        return (action) => {
            console.group(action.type);
            console.log('%c prev state', 'color: gray', store.getState());
            console.log('%c action', 'color: blue', action);
            const returnValue = next(action);
            console.log('%c next state', 'color: green', store.getState());
            console.groupEnd(action.type);
            return returnValue;
        };
    }
};


// 1 middleware :
const promise = (store) => {
    return (next) => {
        return (action) => {
            // si l'action retourne une promesse :
            if (typeof action.then === 'function') {
                return action.then(next);
            }

            // si pas une promesse :
            return next(action);
        }
    }
};

// Middleware est un système puissant qui nous permet de mettre un comportement personnalisé avant que l'action atteint les reducers
const wrapDispatchWithMiddlewares = (store, middlewares) => {
    middlewares.slice().reverse().forEach(middleware => {
        store.dispatch = middleware(store)(store.dispatch); // on appel chaque middleware ('logger', 'promise')
    })
};


// on retourne le 'store' finale (utilisé dans app/index) :
const configureStore = () => {
    const store = createStore(todoApp);
    const middlewares = [promise];

    if (process.env.NODE_ENV !== 'production') {
        middlewares.push(logger);
    }

    wrapDispatchWithMiddlewares(store, middlewares);

    return store;
};

export default configureStore;