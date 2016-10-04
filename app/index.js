import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from './reducers';
import App from './components/App';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';

const persistedState = loadState();
const store = createStore(todoApp, persistedState);
console.log(store.getState());

// fonction appelé à chaque fois que l'etat du localstorage change - 'throttle' va résoudre le probleme de chargement tres répété :
store.subscribe(throttle(() => {
   saveState({
       todos: store.getState().todos
   });
}), 1000);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);