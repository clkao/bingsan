import { createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import promiseMiddleware from 'redux-promise-middleware';

export default function createApiClientStore(client, data) {
  const middleware = createMiddleware(client);
  let finalCreateStore;
  let localState;
  if (__CLIENT__) {
    localState = require('redux-localstorage');
  }
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

  const reducer = require('./modules/reducer');
  const store = finalCreateStore(reducer, data);
  store.client = client;

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
