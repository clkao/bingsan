const LOAD = 'corpus/LOAD'
const LOAD_SUCCESS = 'corpus/LOAD_SUCCESS'
const LOAD_FAIL = 'corpus/LOAD_FAIL'
const IMPORT = 'corpus/IMPORT'
const INIT = 'corpus/INIT'
const DELETE = 'corpus/DELETE'
const SELECT = 'corpus/SELECT'

import Qs from 'qs';
import Immutable from 'immutable';
import { List, Map, Record } from 'immutable';
import { createReducer } from 'redux-immutablejs'

const Corpus = Record({
  title: '',
  body: '',
  info: '',
  source: null,
  content: null,
  isLoaded: false,
  isSelected: false,
});

const initialState = Map({
  items: List()
});

const fromJS = object => {
  console.log('gojs', object);
  return Map({ items: List(object.items.map( x => Corpus(x) )) });
}

export default createReducer(initialState, {
  [LOAD] (state, action) {
    return state;
  },
  [LOAD_SUCCESS] (state, {payload: {item, content}}) {
    console.log("success!", content);
    return state.update('items', items => {
      return items.map( _item => {
        return _item.title === item.title ? _item.set('content', content) : _item
      })
    })
  },
  [LOAD_FAIL] (state, action) {
    return state;
  },
  [IMPORT] (state, {content}) {
    console.log('pushing', content);
    return state.update('items', items => {
      return items.push( Corpus({title: 'blah', content, isLoaded: true, isSelected: true }))
    });
  },
  [SELECT] (state, {item, selected}) {
    return state.update('items', items => {
      return items.map( _item => {
        return _item.title === item.title ? _item.set('isSelected', selected) : _item
      })
    })
  },
  [INIT] (state, action) {
    console.log("meh", state.get('items').count());
    if (state.get('items').count() > 0)
      return state;
    const added = action.items.map( item => Corpus(item) );
    console.log('init', state.get('items').count(), added.length);
    return state.update('items', items => items.push(...added));
  }
}, true, fromJS);

export function init(items) {
  return {type: INIT, items};
}

export function importCorpus(content) {
  return {type: IMPORT, content};
}

export function selectItem(item, selected) {
  return (dispatch) => {
    dispatch({type: SELECT, item, selected});
    if (!item.isLoaded) {
      dispatch(loadCorpus(item));
    }
  }
}

export function loadCorpus(item) {
  let params = {action: 'query', prop: 'info|revisions', format: 'json', rvprop: 'content', titles: item.source.join('|')};
  let url = new URL("http://crossorigin.me/https://zh.wikisource.org/w/api.php?") + Qs.stringify(params);
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    payload: {
      promise: fetch(url).then( response =>
        response.json().then(json => ({ json, response} ))
      ).then(({json, response}) => {
        if (!response.ok)
          return Promise.reject(json);
        const pages = Immutable.Map(json.query.pages);
        console.log('resolving', item);
        return {item, content: pages.map(page => page.revisions[0]['*'])}
      }),
      data: item
    }
  }
}
