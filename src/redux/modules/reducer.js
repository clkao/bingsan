import { combineReducers } from 'redux';

import chooser from './chooser';
import favorites from './favorites';
import corpus from './corpus';

export default combineReducers({
  chooser,
  favorites,
  corpus,
});
