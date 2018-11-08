import React from 'react';
// import { hashHistory, createMemoryHistory, Router } from 'react-router';
import { hashHistory, Router } from 'react-router';
import routes from './routes';

export default () => (
  <Router history={hashHistory} routes={routes} />
);
