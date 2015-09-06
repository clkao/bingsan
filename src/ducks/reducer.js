import { combineReducers } from 'redux';

import chooser from './chooser';
import favorites from './favorites';

export default combineReducers({
  chooser,
  favorites,
});
