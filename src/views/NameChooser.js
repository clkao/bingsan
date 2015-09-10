import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {FontIcon, FlatButton, FloatingActionButton, RaisedButtons, Tabs, Tab, Dialog, Styles} from 'material-ui';
import * as chooserActions from '../ducks/chooser';
import * as favActions from '../ducks/favorites';

let injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
let ThemeManager = new Styles.ThemeManager();

@connect(
  state => ({
    favorites: state.favorites,
    current: state.chooser.current,
    candidates: state.chooser.candidates,
  }),
  dispatch => bindActionCreators({...chooserActions, ...favActions}, dispatch)
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
  }

  importFavDialog() {
    this.refs.importFavDialog.show()
  }

  importFav() {
    const {favAdd} = this.props;
    let lines = this.refs.favList.getDOMNode().value.split(/\n/).filter( (x) => x.length );
    lines.forEach((line) => favAdd(line));
  }

  render() {
    const styles = require('./NameChooser.scss');
    const {current, favorites, candidates} = this.props;
    let standardActions = [
      { text: 'Cancel' },
      { text: 'Submit', onTouchTap: ::this.importFav, ref: 'submit' }
    ];
    return (
      <div className={styles.nameChooser + ' container'}>
        <DocumentMeta title="Bingsan - Choose"/>
        <Tabs>
          <Tab label="文本">
            <label htmlFor="corpus">候選字文本</label>
            <textarea className="corpus" name="corpus" onChange={::this.setCandidates}>
            </textarea>
          </Tab>
          <Tab label="產生">
            <button onClick={::this.generate}>Choose from {candidates.length} chars</button>
            <FloatingActionButton onClick={::this.generate}>
              <FontIcon className="muidocs-icon-content-redo" />
            </FloatingActionButton>
            <div className="candidates">
            {
              current.map( (name) => <FlatButton onClick={()=> this.favAdd(name, event)} key={name} label={name} labelStyle={{fontSize: '30px'}}/>)
            }
            </div>
          </Tab>
          <Tab label="喜愛">
            <button onClick={::this.importFavDialog}>Import</button>
            <ul className="favorite">
            {
              favorites.map( (name) =>
                <li key={name}>
                  {name}
                </li>)
            }
            </ul>
            <Dialog
              ref="importFavDialog"
              title="Dialog With Standard Actions"
              actions={standardActions}
              actionFocus="submit"
              modal={false}>
              <label htmlFor="favList">匯入喜愛名字</label>
              <textarea ref="favList" className="fav" name="fav"></textarea>
            </Dialog>
          </Tab>
        </Tabs>
      </div>
    );
  }

}
