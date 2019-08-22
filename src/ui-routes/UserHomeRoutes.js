import React from "react";
import { Route } from "react-router";
import Flow from "../ui-pages/UserHome/components/Content/Flow";
import DataCompare from '../ui-pages/UserHome/components/Content/Flow/components/DataCompare';

const UserRoutes=()=>{
  return(
    <div>
      <Route exact path="/user-home" component={DataCompare} />
      {/* <Route exact path="/user-home" component={()=><div>dashboard</div>} /> */}
      <Route path="/user-home/flows" component={Flow} />
      <Route path="/user-home/executions" component={()=><div>executions</div>} />
      <Route path="/user-home/users" component={()=><div>users</div>} />
      
    </div>
  )
}

export default UserRoutes;
