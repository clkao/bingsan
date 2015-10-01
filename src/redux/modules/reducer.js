import { combineReducers } from 'redux';
import multireducer from 'multireducer';

import chooser from './chooser';
import favorites from './favorites';
import corpus from './corpus';

export default combineReducers({
  chooser,
  favorites,
  corpus,
});
