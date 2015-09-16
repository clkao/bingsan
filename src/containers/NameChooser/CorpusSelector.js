import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connectReduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {FontIcon, FlatButton, FloatingActionButton, RaisedButtons, Tabs, Tab, Dialog, Paper, List, ListItem, ListDivider, Checkbox, Styles} from 'material-ui';
import * as corpusAction from '../../redux/modules/corpus';

@connect(
  state => ({corpus: state.corpus, items: state.corpus.get('items').toJS() }),
  dispatch => bindActionCreators({...corpusAction}, dispatch)
)
export default class CorpusSelector extends Component {
  static propTypes = {
  }
  componentWillMount() {
    let titles = [
      { title: '莊子',
        source:['莊子/逍遙遊', '莊子/齊物論', '莊子/養生主', '莊子/人間世', '莊子/德充符', '莊子/大宗師', '莊子/應帝王']
      }
    ];
    this.props.init(titles);
  }
  importCorpus() {
    this.props.importCorpus( this.refs.corpusText.getDOMNode().value );
    this.refs.importCorpusDialog.dismiss()
  }
  
  loadCorpus(title) {
    this.props.loadCorpus(title);
  }

  showImportDialog() {
    this.refs.importCorpusDialog.show()
  }
  handleItemCheck(item) { return (e, isChecked) => {
    this.props.selectItem(item, isChecked);
  }}
  render() {
    const styles = require('./NameChooser.scss');
    let standardActions = [
      { text: 'Cancel' },
      { text: 'Submit', onTouchTap: ::this.importCorpus, ref: 'submit' }
    ];
    const {items} = this.props;
    return (
      <List subheader="文本">
        <Dialog
          ref="importCorpusDialog"
          title="Dialog With Standard Actions"
          actions={standardActions}
          actionFocus="submit"
          modal={false}>
          <label htmlFor="corpusText">匯入文本</label>
          <textarea ref="corpusText" className="corpusText" name="corpusText"></textarea>
        </Dialog>
        { items.map( (item) =>
          <ListItem
            leftCheckbox={<Checkbox checked={item.isSelected} onCheck={::this.handleItemCheck(item)}/>}
            primaryText={item.title}
            secondaryText={
              <p>
                {item.excerp}
              </p>
            }
            secondaryTextLines={2} />
          )
        }
        <ListDivider inset={true} />
        <ListItem primaryText="Import..." onClick={::this.showImportDialog} />
      </List>
    );
  }

}
