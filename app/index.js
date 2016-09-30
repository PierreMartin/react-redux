import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from './reducers';
import App from './components/App';

const persistedState = {
    /*
    todos: [{
        id: '0',
        text: 'Welcome back!',
        completed: false
    }],
    visibilityFilter: 'SHOW_ALL'
    */
};

const store = createStore(todoApp, persistedState);
console.log(store.getState());

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);