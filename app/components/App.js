import React from 'react';
import Footer from './Footer';
import AddTodo from './AddTodo';
import VisibleTodoList from './VisibleTodoList';

const App = ({ params }) => (
    <div>
        <AddTodo />
        <VisibleTodoList filter={params.filter || 'all'} />         {/* 'params.filter' récupere le parametre de l'url */}
        <Footer />
    </div>
);

export default App;