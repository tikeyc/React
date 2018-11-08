import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import App from '../App';
import { container as Home } from '../pages/Home';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/home/1" />
    <Route path="home/:type" component={Home} />
  </Route>
);
