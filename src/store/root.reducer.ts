import { combineReducers } from "redux";
import signInReducer from "../screens/user/slice";
import userListReucer from "../screens/dashboard/slice";

const rootReducer = combineReducers({
  signin: signInReducer,
  users: userListReucer,
});

export default rootReducer;
