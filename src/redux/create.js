import { createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import promiseMiddleware from 'redux-promise-middleware';

export default function createApiClientStore(client, data) {
  const reducer = require('./modules/reducer');
  const middlewares = applyMiddleware(promiseMiddleware, createMiddleware(client));
  let localState;
  let finalCreateStore;
  let finalReducer;
  if (__CLIENT__) {
    localState = require('redux-localstorage');
    const {mergePersistedState} = localState;
    finalReducer = compose(mergePersistedState())(reducer);
  }
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { devTools, persistState } = require('redux-devtools');
    finalCreateStore = compose(
      middlewares,
      devTools(),
      localState.default(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  } else if (__CLIENT__) {
    finalCreateStore = compose(middlewares, localState.default())(createStore);
  } else {
    finalCreateStore = middlewares(createStore);
    finalReducer = reducer;
  }

  const store = finalCreateStore(finalReducer, data);
  store.client = client;

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
