import React from 'react';
import {Route} from 'react-router';
import App from 'views/App';
import Home from 'views/Home';
import NameChooser from 'views/NameChooser';
import NotFound from 'views/NotFound';

export default function(store) {
  return (
    <Route component={App}>
      <Route path="/" component={Home}/>
      <Route path="/chooser" component={NameChooser}/>
      <Route path="*" component={NotFound}/>
    </Route>
  );
}
