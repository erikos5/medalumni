import { SET_THEME } from '../types';

const themeReducer = (state, action) => {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        darkMode: action.payload
      };
    default:
      return state;
  }
};

export default themeReducer; 