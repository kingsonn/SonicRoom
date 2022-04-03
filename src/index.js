import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";


import AdminLayout from "layouts/Admin.js";
import View from "views/Dashboard/Dashboard/View";
import Billing from "views/Dashboard/Billing";
import VideoOnDemand from 'views/Dashboard/VideoOnDemand'

ReactDOM.render(
  <HashRouter>
    <Switch>
 
      <Route path={`/home`} component={AdminLayout} />
      <Route path={`/views/:userAddress`}>
       <View/>
       </Route> 
      <Route path={`/videos/:url`}>
       <VideoOnDemand/>
       </Route> 
      <Redirect from={`/`} to="/home/explore" />
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
