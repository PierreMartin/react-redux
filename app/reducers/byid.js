const byId = (state = {}, action) => {
    if (action.response) {
        return {
            ...state,
            ...action.response.entities.todos // objet créer par 'normalizr'
        }
    }

    return state;
};


export default byId;

export const getTodo = (state, id) => state[id];