import React from 'react';
import {Route} from 'react-router';
import App from './App';
import Home from './Home';
import NameChooser from './NameChooser';
import NotFound from './NotFound';

export default function(store) {
  return (
    <Route component={App}>
      <Route path="/" component={Home}/>
      <Route path="/chooser" component={NameChooser}/>
      <Route path="*" component={NotFound}/>
    </Route>
  );
}
