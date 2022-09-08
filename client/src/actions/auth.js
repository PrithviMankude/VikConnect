import axios from 'axios';
import { REGISTER_SUCCESS, REGISTER_FAIL } from './types';
import { USER_LOADED, AUTH_ERROR } from './types';
import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_PROFILE } from './types';
//Import setAlert 'action' for sending it to alert reducer
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';

//Load user-- This gets the specific user details once the token is verified;
//Runs only when the first time user loads, so we need to add it in main app too
export const loadUser = () => async (dispatch) => {
  //Sets teh header for the tokenusing localStorage.getItem() would be better na.
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//Register User to the backend and based on the result will call on reducers
const register =
  ({ name, password, email }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post('/api/users', body, config);

      //On success we need to dispatch action for the reducer, On success it will get token in res.data
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      //This is required as once the user is authenticated we need full user details,otherwise will have only token
      //and anyways need to query again for user details
      dispatch(loadUser());
    } catch (err) {
      //Get the errors array from the backend it will be in errors []
      const errors = err.response.data.errors;

      // But we also want to display alert for errors (an array 0f errors)
      if (errors) {
        console.log('Here: ' + errors);
        //Make it an array
        dispatch(setAlert(errors.msg, 'danger'));
        //errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      //We simply clear the token from the reducer so no need of any data here
      dispatch({ type: REGISTER_FAIL });
    }
  };

//Login user
export const login =
  ({ email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post('api/auth', body, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        dispatch(setAlert(errors.msg, 'danger'));
      }
      dispatch({
        type: LOGIN_FAIL,
      });
    }
  };

//Logout / Clear Profiles
export const logout = () => (dispatch) => {
  console.log('Entered logout');
  dispatch({
    type: CLEAR_PROFILE,
  });
  dispatch({
    type: LOGOUT,
  });
};

export default register;
