import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { pushState } from 'redux-router';

const title = 'Bingsan - 名產';
const description = '名稱產生器';
const image = 'http://bingsan.clkao.org/logo.png';

const meta = {
  title,
  description,
  meta: {
    charSet: 'utf-8',
    property: {
      'og:site_name': title,
      'og:image': image,
      'og:locale': 'en_US',
      'og:title': title,
      'og:description': description,
      'twitter:card': 'summary',
      'twitter:site': '@clkao',
      'twitter:creator': '@clkao',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
      'twitter:image:width': '200',
      'twitter:image:height': '200'
    }
  }
};

const NavbarLink = ({to, children}) => (
  <Link to={to} activeStyle={{
    color: 'red'
  }}>
    {children}
  </Link>
);

@connect(
    () => ({user: null}),
    dispatch => bindActionCreators({pushState}, dispatch))
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState(null, '/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState(null, '/');
    }
  }

  handleLogout(event) {
    event.preventDefault();
    // this.props.logout();
  }

  render() {
    const styles = require('./App.scss');
    return (
      <div className={styles.app}>
        <DocumentMeta {...meta}/>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <Link to="/" className="navbar-brand">
              <div className={styles.brand}/>
              Bingsan - 名產
            </Link>

            <ul className="nav navbar-nav">
              <li><NavbarLink to="/chooser/">Chooser</NavbarLink></li>
              <li><NavbarLink to="/about">About</NavbarLink></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="https://github.com/clkao/bingsan"
                   target="_blank" title="View on Github"><i className="fa fa-github"/></a>
              </li>
            </ul>
          </div>
        </nav>
        <div className={styles.appContent}>
          {this.props.children}
        </div>
        <div className="well text-center">
          Logo and Emoji provided free by <a href="http://emojione.com/">Emoji One</a>
        </div>
      </div>
    );
  }
}
