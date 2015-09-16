const SET_CURRENT = 'chooser/SET_CURRENT';
const SET_MAXSTROKE = 'chooser/SET_MAXSTROKE';

export const charMap = new Map();

import chars from '../../chars';
import {moe4808} from '../../moe4808';

chars.map( (c) => {
  if (!c.bopomofo) return;

  if (c.bopomofo.match(/ˇ/)) {
    c.tone = 3;
  } else if (c.bopomofo.match(/ˋ/)) {
    c.tone = 4;
  } else if (c.bopomofo.match(/ˊ/)) {
    c.tone = 2;
  } else if (c.bopomofo.match(/˙/)) {
    c.tone = 5;
  } else {
    c.tone = 1;
  }

  charMap.set(c.title, c);
});

for (const c of moe4808) {
  charMap.get(c).common = true;
}

const initialState = {
  loaded: false,
  candidates: [],
  current: [],
  maxStroke: 10
};

const handlers = {
  [SET_CURRENT](state, action) {
    return {
      ...state,
      current: action.current
    };
  },
  [SET_MAXSTROKE](state, {maxStroke}) {
    return {
      ...state,
      maxStroke: maxStroke
    };
  }
};

export default function reducer(state = initialState, action = {}) {
  if (handlers[action.type]) {
    return handlers[action.type](state, action);
  }

  return state;
}

export function setCurrent(current) {
  return {type: SET_CURRENT, current};
}

export function setMaxStroke(maxStroke) {
  return {type: SET_MAXSTROKE, maxStroke};
}
