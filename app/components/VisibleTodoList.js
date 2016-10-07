import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../actions';
import { getVisibleTodos, getIsFetching } from '../reducers';
import TodoList from './TodoList';


class VisibleTodoList extends Component {
    componentDidMount() {
        this.fetchData();
    }

    // permet d'upoader le componant si changement de filtre ('all', 'active', 'completed') :
    componentDidUpdate(prevProps) {
        if (this.props.filter !== prevProps.filter) {
            this.fetchData();
        }
    }

    fetchData() {
        const { filter, fetchTodos } = this.props; // les props ('fetchTodos') viennent des actions
        fetchTodos(filter);
     // fetchTodos(filter).then(() => console.log('Done !'));
    }

    render() {
        const { toggleTodo, todos, isFetching } = this.props;

        if (isFetching && !todos.lenght) {
            return <p>Loading...</p>;
        }

        return (
            <TodoList todos={todos} onTodoClick={toggleTodo} />
        )
    }
}


VisibleTodoList.propTypes = {
    filter: PropTypes.oneOf(['all', 'active', 'completed']).isRequired,
    toggleTodo: PropTypes.func.isRequired
};

const mapStateToProps = (state, { params }) => {
    const filter = params.filter || 'all';

    return {
        todos: getVisibleTodos(state, filter),      // fonction defini dans le reducer
        isFetching: getIsFetching(state, filter),   // fonction defini dans le reducer
        filter
    }
};

VisibleTodoList = withRouter(connect(mapStateToProps, actions)(VisibleTodoList));

export default VisibleTodoList;