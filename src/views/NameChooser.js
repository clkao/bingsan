import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import chars from '../chars'
import {RaisedButtons, Tabs, Tab, Styles} from 'material-ui';
let injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
let ThemeManager = new Styles.ThemeManager();

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
  static childContextTypes = {
    muiTheme: PropTypes.object
  }
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }
  componentWillMount() {
    this.setState({current: [], candidates: [], favorites: []});
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
        <DocumentMeta title="Bingsan - Choose"/>
        <Tabs>
          <Tab label="文本">
            <label htmlFor="corpus">候選字文本</label>
            <textarea className="corpus" name="corpus" onChange={::this.setCandidates}>
            </textarea>
          </Tab>
          <Tab label="產生" onClick={::this.generate}>
            <h1>Choose from {this.state.candidates.length} chars</h1>
            <button onClick={::this.generate}>Generate</button>
            <ul className="candidates">
            {
              this.state.current.map( (name) => 
                <li key={name} className={'p' + Array.from(name).map( (c) => charMap.get(c).tone ).join('')   }>
                  {name}
                </li>)
            }
            </ul>
          </Tab>
          <Tab label="喜愛">
            <ul className="favorite">
            {
              this.state.favorites.map( (name) =>
                <li key={name} className={'p' + Array.from(name).map( (c) => charMap.get(c).tone ).join('')   }>
                  {name}
                </li>)
            }
            </ul>
          </Tab>
        </Tabs>
      </div>
    );
  }

}
