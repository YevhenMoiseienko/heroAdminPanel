import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import heroes from "../reducers/heroes";
import filters from "../reducers/filters";
import ReduxThunk from "redux-thunk";

const store = createStore(combineReducers({heroes, filters}),
    compose(applyMiddleware(ReduxThunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));

export default store;