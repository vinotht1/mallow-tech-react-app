import { combineReducers } from "redux";
import signInReducer from "../screens/user/slice";

const rootReducer = combineReducers({
    signin: signInReducer,
});

export default rootReducer;
