const CHOOSE = 'chooser/CHOOSE'
const SET_CANDIDATE = 'chooser/SET_CANDIDATE'
const SET_CURRENT = 'chooser/SET_CURRENT'
const FAV_ADD = 'chooser/FAV_ADD'
const FAV_REMOVE = 'chooser/FAV_REMOVE'

//const chars = require '../chars';
import chars from '../chars'
export var charMap = new Map();
chars.map( function(c) {
  if (!c.bopomofo) return;

  if (c.bopomofo.match(/ˇ/))
    c.tone = 3
  else if (c.bopomofo.match(/ˋ/))
    c.tone = 4
  else if (c.bopomofo.match(/ˊ/))
    c.tone = 2
  else if (c.bopomofo.match(/˙/))
    c.tone = 5
  else
    c.tone = 1

  charMap.set(c.title, c)
});

const initialState = {
  loaded: false,
  favlist: [],
  candidates: [],
  current: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_CANDIDATE:
      var candidates = {};
      for (var char in action.corpus) {
        let c = charMap.get(action.corpus[char]);
        if (c && c.count <= 10) {
          candidates[action.corpus[char]]++;
        }
      }
      return {
        ...state,
        candidates: Object.keys(candidates),
      }
    case SET_CURRENT:
      return {
        ...state,
        current: action.current
      };
    case FAV_ADD:
      return {
        ...state,
        favlist: [...state.favlist, action.name]
      };
    case FAV_REMOVE:
      index = state.favlist.indexOf(action.name);
      if (index < 0)
        return state;
      return {
        ...state,
        favlist: state.favlist.map( (x) => x != action.name )
      };
    default:
      return state;
  }
}

export function favAdd(name) {
  return {type: FAV_ADD, name }
}

export function favRemove(name) {
  return {type: FAV_REMOVE, name }
}

export function setCandidates(corpus) {
  return {type: SET_CANDIDATE, corpus}
}

export function choose(count) {
  return (dispatch, getState) => {
    dispatch({type: CHOOSE, count});
    const {candidates} = getState().chooser;
    let get = () => candidates[Math.floor(Math.random() * candidates.length)]
    let current = [];
    while (current.length < count) {
      let chars = [0, 1].map( () => charMap.get(get()));
      let tones = chars.map( (c) => c.tone )
      if (tones[0] <= 2 && tones[1] <= 2)
        continue;
      if (tones[0] > 2 && tones[1] > 2)
        continue;
      current.push( chars.map( (c) => c.title ).join('') )
    }
    return dispatch({type: SET_CURRENT, current});
  }
}
