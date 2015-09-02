import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {RaisedButtons, Tabs, Tab, Styles} from 'material-ui';
import * as chooserActions from '../ducks/chooser';

let injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
let ThemeManager = new Styles.ThemeManager();

@connect(
  state => ({
    favorites: state.chooser.favlist,
    current: state.chooser.current,
    candidates: state.chooser.candidates,
  }),
  dispatch => bindActionCreators(chooserActions, dispatch)
)
export default class NameChooser extends Component {
  static propTypes = {
    favAdd: PropTypes.func.isRequired,
    favRemove: PropTypes.func.isRequired,
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
    //this.setState({current: [], candidates: [], favorites: []});
  }
  setCandidates(event) {
    var candidates = {};
    this.props.setCandidates( event.target.value);
  }

  generate() {
    this.props.choose(30);
  }

  favAdd(name, event) {
    this.props.favAdd(name);
    event.stopPropagation();
  }

  importFav() {
    const {favAdd} = this.props;
    let lines = this.refs.favList.getDOMNode().value.split(/\n/).filter( (x) => x.length );
    lines.forEach((line) => favAdd(line));
  }

  render() {
    const styles = require('./NameChooser.scss');
    const {current, favorites, candidates} = this.props;
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
            <h1>Choose from {candidates.length} chars</h1>
            <ul className="candidates">
            {
              current.map( (name) =>
                <li onClick={()=> this.favAdd(name, event)} key={name}>
                  {name}
                </li>)
            }
            </ul>
          </Tab>
          <Tab label="喜愛">
            <label htmlFor="corpus">候選字文本</label>
            <textarea ref="favList" className="fav" name="fav"></textarea>
            <button onClick={::this.importFav}>Import</button>
            <ul className="favorite">
            {
              favorites.map( (name) =>
                <li key={name}>
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
