import { SET_ALERT } from '../actions/types';
import { REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function alert(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return [...state, payload]; //array cos there can be many set_alert actions at the same time
    case REMOVE_ALERT:
      //Not using ...state as filter returns a new array anyways
      return state.filter((alert) => alert.id !== payload);

    default:
      return state;
  }
}
