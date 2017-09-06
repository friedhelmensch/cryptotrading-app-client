import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import Home from './containers/Home';
import AppliedRoute from './components/AppliedRoute';
import Signup from './containers/Signup';
import NewSetting from './containers/NewSetting';
import Settings from './containers/Settings';
import Profile from './containers/Profile';
import Orders from './containers/Orders';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
    <AuthenticatedRoute path="/orders" exact component={Orders} props={childProps} />
    <AuthenticatedRoute path="/profile" exact component={Profile} props={childProps} />
    <AuthenticatedRoute path="/settings/new" exact component={NewSetting} props={childProps} />
    <AuthenticatedRoute path="/settings/:id" exact component={Settings} props={childProps} />
    <Route component={NotFound} />
  </Switch>
);