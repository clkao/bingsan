import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import chars from '../chars'

var charMap = new Map();
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

/*
@connect(
  state => ({user: state.auth.user}),
  dispatch => bindActionCreators(authActions, dispatch)
)
*/
export default class NameChooser extends Component {
  static propTypes = {
//    onLike: 
  }
  componentWillMount() {
    this.setState({current: [], candidates: []});
  }
  setCandidates(event) {
    var candidates = {};
    const string = event.target.value;
    for (var char in string) {
      let c = charMap.get(string[char]);
      if (c && c.count <= 10) {
        candidates[string[char]]++;
      }
    }
    this.setState({candidates: Object.keys(candidates)});
  }
  
  generate() {
    const {candidates} = this.state;
    let get = () => candidates[Math.floor(Math.random() * candidates.length)]
    let current = [];
    for (var i = 0; i < 100; ++i) {
      current.push(get() + get());
    }
    this.setState({current});
    
  }

  render() {
//    const {user, logout} = this.props;
    const styles = require('./NameChooser.scss');
    return (
      <div className={styles.nameChooser + ' container'}>
        <DocumentMeta title="React Redux Example: Login"/>
        <h1>Choose from {this.state.candidates.length} chars</h1>
        <textarea name="candidates" onChange={::this.setCandidates}>
        </textarea>
        <input type="button" onClick={::this.generate} value="generate" />
        <ul>
        {
          this.state.current.map( (name) => 
            <li key={name} className={'p' + Array.from(name).map( (c) => charMap.get(c).tone ).join('')   }>
              {name}
            </li>)
        }
        </ul>
      </div>
    );
  }

}
