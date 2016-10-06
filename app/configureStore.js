import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import todoApp from './reducers';



// Middleware est un système puissant qui nous permet de mettre un comportement personnalisé avant que l'action atteint les reducers
// on retourne le 'store' finale (utilisé dans app/index) :
const configureStore = () => {
    const middlewares = [promise];

    if (process.env.NODE_ENV !== 'production') {
        middlewares.push(createLogger());
    }

    return createStore(todoApp, applyMiddleware(...middlewares)); // return 'store'
};

export default configureStore;