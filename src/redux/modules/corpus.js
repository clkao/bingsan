const LOAD = 'corpus/LOAD';
const LOAD_SUCCESS = 'corpus/LOAD_SUCCESS';
const LOAD_FAIL = 'corpus/LOAD_FAIL';
const IMPORT = 'corpus/IMPORT';
const INIT = 'corpus/INIT';
const SELECT = 'corpus/SELECT';

import Qs from 'qs';
import Immutable from 'immutable';
import { List, Map, Record } from 'immutable';
import { createReducer } from 'redux-immutablejs';
require('isomorphic-fetch');

const Corpus = new Record({
  title: '',
  body: '',
  info: '',
  source: null,
  content: null,
  isLoaded: false,
  isSelected: false,
});

const initialState = new Map({
  items: new List()
});

const fromJS = object => new Map({ items: new List(object.items.map( x => new Corpus(x) )) });

export default createReducer(initialState, {
  [LOAD](state) {
    return state;
  },
  [LOAD_SUCCESS](state, {payload: {item, content}}) {
    return state.update('items', items => {
      return items.map( _item => {
        return _item.title === item.title ? _item.set('content', content) : _item;
      });
    });
  },
  [LOAD_FAIL](state) {
    return state;
  },
  [IMPORT](state, {content}) {
    console.log('pushing', content);
    return state.update('items', items => items.push( new Corpus({title: 'blah', content, isLoaded: true, isSelected: true })));
  },
  [SELECT](state, {item, selected}) {
    return state.update('items', items => items.map( _item => _item.title === item.title ? _item.set('isSelected', selected) : _item ));
  },
  [INIT](state, action) {
    if (state.get('items').count() > 0) {
      return state;
    }
    const added = action.items.map( item => new Corpus(item) );
    return state.update('items', items => items.push(...added));
  }
}, true, fromJS);

export function init(items) {
  return {type: INIT, items};
}

export function importCorpus(content) {
  return {type: IMPORT, content};
}

export function loadCorpus(item) {
  const params = {action: 'query', prop: 'info|revisions', format: 'json', rvprop: 'content', titles: item.source.join('|')};
  const url = new URL('http://crossorigin.me/https://zh.wikisource.org/w/api.php?') + Qs.stringify(params);
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    payload: {
      promise: fetch(url).then( response =>
        response.json().then(json => ({ json, response} ))
      ).then(({json, response}) => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        const pages = new Immutable.Map(json.query.pages);
        return {item, content: pages.map(page => page.revisions[0]['*'])};
      }),
      data: item
    }
  };
}

export function selectItem(item, selected) {
  return (dispatch) => {
    dispatch({type: SELECT, item, selected});
    if (!item.isLoaded) {
      dispatch(loadCorpus(item));
    }
  };
}
