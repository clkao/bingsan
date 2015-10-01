import React from 'react';
import {Route} from 'react-router';
import {
    App,
    Home,
    NameChooser,
    NotFound,
  } from 'containers';

export default function(history) {
  return (
    <Route component={App} history={history}>
      <Route path="/" component={Home}/>
      <Route path="/chooser/" component={NameChooser}/>
      <Route path="*" component={NotFound}/>
    </Route>
  );
}
