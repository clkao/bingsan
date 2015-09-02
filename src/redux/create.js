import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createMiddleware from './clientMiddleware';

//import filter from 'redux-localstorage-filter';

import adapter from 'redux-localstorage/lib/adapters/localStorage';
import persistState from 'redux-localstorage'

let localState = persistState;

export default function createApiClientStore(client, data) {
  const middleware = createMiddleware(client);
  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { devTools, persistState } = require('redux-devtools');
    finalCreateStore = compose(
      applyMiddleware(middleware),
      devTools(),
      localState(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
      createStore
    );
  }
  else if (__CLIENT__) {
    finalCreateStore = compose(applyMiddleware(middleware), localState(), createStore);
  }
  else {
    finalCreateStore = compose(applyMiddleware(middleware), createStore);
  }

  const reducer = require('../ducks/reducer');
  const store = finalCreateStore(reducer, data);
  store.client = client;

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('../ducks/reducer', () => {
      store.replaceReducer(require('../ducks/reducer'));
    });
  }

  return store;
}
