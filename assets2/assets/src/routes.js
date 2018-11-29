import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import App from './app/pages/app';
import { view as Home } from './app/pages/Home';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/dashboard" />
    <Route path="dashboard" component={Home} noAside />
  </Route>
);
