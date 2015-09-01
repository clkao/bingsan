import React, {Component} from 'react';
import {Link} from 'react-router';
import GithubButton from '../components/GithubButton';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    // require the logo image both from client and server
    const logoImage = require('./logo.svg');
    return (
      <div className={styles.home}>
        <div className={styles.masthead}>
          <div className="container">
            <div className={styles.logo}>
              <p>
                <img src={logoImage}/>
              </p>
            </div>
            <h1>名稱產生器</h1>
            <GithubButton user="clkao"
                          repo="bingsan"
                          type="star"
                          width={160}
                          height={30}
                          count large/>
          </div>
        </div>

        <div className="container">
            <Link to="/chooser" className="btn btn-primary">來吧</Link>
        </div>
      </div>
    );
  }
}
