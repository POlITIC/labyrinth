import initialState from "./initialState";
import reducer from "./reducers/rootReducer";
import {createStore} from 'redux';

const store = createStore(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
