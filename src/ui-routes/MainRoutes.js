import React from "react";
import { Route } from "react-router";
import Login from "../ui-pages/Login";
import UserHome from "../ui-pages/UserHome";
import Landing from "../ui-pages/Landing";
import ConnectionTable from "../ui-containers/connectionTable";
import DataCompare from "../ui-pages/UserHome/components/Content/Flow/components/DataCompare";

const MainRoutes=()=>{
  return(
    <div>
      <Route exact path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/user-home" component={UserHome} />
      <Route path="/con" component={ConnectionTable} />
      <Route path="/data" component={DataCompare} />
    </div>
  )
}

export default MainRoutes;
