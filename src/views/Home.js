import React, {Component} from 'react';
import {Link} from 'react-router';
import GithubButton from '../components/GithubButton';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    // require the logo image both from client and server
    const logoImage = require('./logo.png');
    return (
      <div className={styles.home}>
        <div className={styles.masthead}>
          <div className="container">
            <div className={styles.logo}>
              <p>
                <img src={logoImage}/>
              </p>
            </div>
            <h1>OHAI</h1>
            <GithubButton user="erikras"
                          repo="react-redux-universal-hot-example"
                          type="star"
                          width={160}
                          height={30}
                          count large/>
          </div>
        </div>

        <div className="container">
            <h1>Hi Again</h1>
        </div>
      </div>
    );
  }
}
