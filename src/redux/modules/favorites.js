const FAV_ADD = 'chooser/FAV_ADD'
const FAV_REMOVE = 'chooser/FAV_REMOVE'

import { createReducer } from 'redux-immutablejs'

export function favAdd(name) {
  return {type: FAV_ADD, name }
}

export function favRemove(name) {
  return {type: FAV_REMOVE, name }
}

import Immutable from 'immutable';

export default createReducer([], {
  [FAV_ADD] (state, action) {
    return state.add(action.name)
  },
  [FAV_REMOVE] (state, action) {
    return state.remove(action.name)
  }
}, true, ::Immutable.OrderedSet);

