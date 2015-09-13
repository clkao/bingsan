import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {FontIcon, FlatButton, FloatingActionButton, RaisedButtons, Tabs, Tab, Dialog, Paper, List, ListItem, ListDivider, Checkbox, Slider, Styles} from 'material-ui';
import * as chooserActions from '../ducks/chooser';
import * as favActions from '../ducks/favorites';
import CorpusSelector from './CorpusSelector';
import {createSelector} from 'reselect';

let injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
let ThemeManager = new Styles.ThemeManager();
let {charMap} = chooserActions;

const corpusState = state => state.corpus
const chooserState = state => state.chooser
const favoritesState = state => state.favorites

const corpusContent = createSelector(corpusState, (corpus) => {
  console.log('recalculate corpus');
  let content = corpus.get('items').filter(x => x.isSelected).map(x => Array.isArray(x.content) ? x.content.join('') : x.content).toArray();
  return content;
});

const selector = createSelector([corpusContent, chooserState, favoritesState], (corpusContent, chooser, favorites) => {
  var candidates = {};
  console.log('map state', corpusContent, chooser, candidates);
  let content = corpusContent.join('');
  
  for (var char in content) {
    let c = charMap.get(content[char]);
    if (c && c.count <= chooser.maxStroke) {
      candidates[content[char]]++;
    }
  }
  
  return {
    favorites,
    candidates: Object.keys(candidates),
    current: chooser.current,
    maxStroke: chooser.maxStroke,
  }
})

@connect(
  selector,
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

  componentWillReceiveProps(nextProps) {
  }

  generate() {
    this.choose(30);
  }

  choose(count) {
    const {candidates} = this.props;
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
    
    this.props.setCurrent(current);
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
    this.refs.importFavDialog.dismiss()
  }
  
  updateMaxStroke(e, value) {
    console.log("updating", value);
    this.props.setMaxStroke(value);
  }
  render() {
    const styles = require('./NameChooser.scss');
    const {current, favorites, candidates, maxStroke} = this.props;
    let standardActions = [
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
