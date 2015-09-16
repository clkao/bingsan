import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {FontIcon, FlatButton, FloatingActionButton, Tabs, Tab, Dialog, Slider, TextField, Styles} from 'material-ui';
import * as chooserActions from '../../redux/modules/chooser';
import * as favActions from '../../redux/modules/favorites';
import CorpusSelector from './CorpusSelector';
import {createSelector} from 'reselect';

const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();
const ThemeManager = new Styles.ThemeManager();
const {charMap} = chooserActions;

const corpusState = state => state.corpus;
const chooserState = state => state.chooser;
const favoritesState = state => state.favorites;

const corpusContent = createSelector(corpusState, (corpus) => {
  return corpus.get('items').filter(x => x.isSelected).map(x => Array.isArray(x.content) ? x.content.join('') : x.content).toArray();
});

const selector = createSelector([corpusContent, chooserState, favoritesState], (_corpusContent, chooser, favorites) => {
  const candidates = {};
  const content = _corpusContent.join('');
  // XXX: make this an option
  chooser.requireCommon = true;

  for (const char of content) {
    const c = charMap.get(char);
    if (c) {
      if (!c.common && chooser.requireCommon) {
        continue;
      }
      if (c.count > chooser.maxStroke) {
        continue;
      }
      candidates[char]++;
    }
  }

  return {
    favorites,
    candidates: Object.keys(candidates),
    current: chooser.current,
    maxStroke: chooser.maxStroke,
  };
});

function *getName(candidates, firstName, lastName = '') {
  const get = () => candidates[Math.floor(Math.random() * candidates.length)];
  const genName = () => [0, 1].map( (i) => charMap.get( firstName[i] || get() ));
  for (;;) {
    const chars = genName();
    const tones = chars.map( c => c.tone );
    if (tones[0] <= 2 && tones[1] <= 2) {
      continue;
    }
    if (tones[0] > 2 && tones[1] > 2) {
      continue;
    }
    yield lastName + chars.map( (c) => c.title ).join('');
  }
}

@connect(
  selector,
  dispatch => bindActionCreators({...chooserActions, ...favActions}, dispatch)
)
export default class NameChooser extends Component {
  static propTypes = {
    favAdd: PropTypes.func.isRequired,
    favRemove: PropTypes.func.isRequired,
    setMaxStroke: PropTypes.func.isRequired,
    setCurrent: PropTypes.func.isRequired,
    maxStroke: PropTypes.number.isRequired,
    candidates: PropTypes.array.isRequired,
    current: PropTypes.array.isRequired,
    favorites: PropTypes.array.isRequired,
  }
  static childContextTypes = {
    muiTheme: PropTypes.object
  }
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }
  generate() {
    this.choose(30);
  }

  choose(count) {
    const {candidates} = this.props;
    const [lastName, ...firstName] = ['lastName', 'firstName1', 'firstName2'].map( (key) => this.refs[key].getValue() );
    const g = getName(candidates, firstName, lastName);
    const current = Array.from(Array(count)).map( () => g.next().value );
    this.props.setCurrent(current);
  }

  favAdd(name) {
    this.props.favAdd(name);
  }

  importFavDialog() {
    this.refs.importFavDialog.show();
  }

  importFav() {
    const {favAdd} = this.props;
    const lines = this.refs.favList.getDOMNode().value.split(/\n/).filter( (x) => x.length );
    lines.forEach((line) => favAdd(line));
    this.refs.importFavDialog.dismiss();
  }

  updateMaxStroke(e, value) {
    this.props.setMaxStroke(value);
  }
  render() {
    const styles = require('./NameChooser.scss');
    const {current, favorites, candidates, maxStroke} = this.props;
    const standardActions = [
      { text: 'Cancel' },
      { text: 'Submit', onTouchTap: ::this.importFav, ref: 'submit' }
    ];
    return (
      <div className={styles.nameChooser + ' container'}>
        <DocumentMeta title="Bingsan - Choose"/>
        <Tabs>
          <Tab label="文本">
            <CorpusSelector />
          </Tab>
          <Tab label="產生">
            <Slider name="maxStroke" value={maxStroke} step={1} min={0} max={30} onChange={::this.updateMaxStroke}/>
            <TextField ref="lastName" floatingLabelText="姓" style={{width: '2em'}}/>
            <TextField ref="firstName1" floatingLabelText="名(1)" style={{width: '4em'}}/>
            <TextField ref="firstName2" floatingLabelText="名(2)" style={{width: '4em'}}/>
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
