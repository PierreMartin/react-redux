import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // thunk middleware (remplace 'redux-promise') - permet de dispatcher plusieurs actions de manière asynchrone :
import createLogger from 'redux-logger'; // console.group
import todoApp from './reducers';


// Middleware est un système puissant qui nous permet de mettre un comportement personnalisé avant que l'action atteint les reducers
// on retourne le 'store' finale (utilisé dans app/index) :
const configureStore = () => {
    const middlewares = [thunk];

    if (process.env.NODE_ENV !== 'production') {
        middlewares.push(createLogger());
    }

    return createStore(todoApp, applyMiddleware(...middlewares)); // return 'store'
};

export default configureStore;