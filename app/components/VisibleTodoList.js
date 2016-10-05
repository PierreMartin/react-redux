import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { toggleTodo } from '../actions';
import { getVisibleTodos } from '../reducers';
import TodoList from './TodoList';


const mapStateToProps = (state, { params }) => ({
    todos: getVisibleTodos(state, params.filter || 'all')
});


/*
const mapDispatchToProps = (dispatch) => ({
    onTodoClick(id) {                               // props
        dispatch(toggleTodo(id));                   // action
    }
});

const VisibleTodoList = withRouter(connect(mapStateToProps, mapDispatchToProps)(TodoList));
*/

// moyen plus court (si le param du props est le meme que pour l'action) / souvent on aura pas besoin d'écrire la function 'mapDispatchToProps'
const VisibleTodoList = withRouter(connect(mapStateToProps, { onTodoClick: toggleTodo })(TodoList));

export default VisibleTodoList;