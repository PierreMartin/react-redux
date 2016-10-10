import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../actions';
import { getVisibleTodos, getIsFetching, getErrorMessage } from '../reducers';
import TodoList from './TodoList';
import FetchError from './FetchError';


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
        const { toggleTodo, errorMessage, todos, isFetching } = this.props; // les props ('errorMessage', 'isFetching') viennent des reducers

        if (isFetching && !todos.length) {
            return <p>Loading...</p>;
        }

        if (errorMessage && !todos.length) {
            return (
                <FetchError
                    message={errorMessage}
                    onRetry={() => this.fetchData()}
                />
            );
        }

        return (
            <TodoList
                todos={todos}
                onTodoClick={toggleTodo}
            />
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
        isFetching: getIsFetching(state, filter),       // fonction defini dans le reducer
        errorMessage: getErrorMessage(state, filter),   // fonction defini dans le reducer
        todos: getVisibleTodos(state, filter),          // fonction defini dans le reducer
        filter
    }
};

VisibleTodoList = withRouter(connect(mapStateToProps, actions)(VisibleTodoList));

export default VisibleTodoList;