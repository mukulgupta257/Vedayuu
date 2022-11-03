import {applyMiddleware, createStore, compose} from "redux";
import reducer from "../Reducers";
const thunkMiddleware = require('redux-thunk').default;

// const store = createStore(reducer, compose(applyMiddleware(thunkMiddleware),window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));
const store = createStore(reducer,applyMiddleware(thunkMiddleware));
export default store;
