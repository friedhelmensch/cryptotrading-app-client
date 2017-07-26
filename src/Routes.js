import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import Home from './containers/Home';
import AppliedRoute from './components/AppliedRoute';
import Signup from './containers/Signup';
import NewSetting from './containers/NewSetting';
import Settings from './containers/Settings';

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
    <AppliedRoute path="/settings/new" exact component={NewSetting} props={childProps} />
    <AppliedRoute path="/settings/:id" exact component={Settings} props={childProps} />
    <Route component={NotFound} />
  </Switch>
);