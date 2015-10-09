import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import chooser from './chooser';
import favorites from './favorites';
import corpus from './corpus';

export default combineReducers({
  router: routerStateReducer,
  chooser,
  favorites,
  corpus,
});
