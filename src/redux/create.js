import { createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './clientMiddleware';

//import filter from 'redux-localstorage-filter';

import adapter from 'redux-localstorage/lib/adapters/localStorage';
import persistState from 'redux-localstorage'
import promiseMiddleware from 'redux-promise-middleware';

let localState = persistState;

export default function createApiClientStore(client, data) {
  const middleware = createMiddleware(client);
  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { devTools, persistState } = require('redux-devtools');
    finalCreateStore = compose(
      applyMiddleware(promiseMiddleware, middleware),
      devTools(),
      localState(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  } else if (__CLIENT__) {
    finalCreateStore = compose(applyMiddleware(middleware), localState())(createStore);
  } else {
    finalCreateStore = applyMiddleware(middleware)(createStore);
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
