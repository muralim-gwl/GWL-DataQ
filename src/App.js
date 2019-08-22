import React from "react";
import { withRouter } from "react-router-dom";
import Snackbar from "./ui-containers/SnackBar";
import CircularProgress from "@material-ui/core/CircularProgress";
import {mapDispatchToProps} from "./ui-utils/commons";
import MainRoutes from "./ui-routes/MainRoutes";
import { connect } from "react-redux";
import "./App.css";


class App extends React.Component {
  componentDidMount=async()=>{
    const {setAppData}=this.props;
    let appConfig=await fetch("https://raw.githubusercontent.com/muralimgwl/GWL-DataQ/dev/data/app-configuration.json?timestamp="+new Date().getTime())
      .then(function(response) {
        return response.json();
      })
      .catch(error => console.error(error));
    // console.log(flowComponents);
    setAppData("appConfig",appConfig)
  }

  render() {
    const { spinner } = this.props;
    return (
      <div>
        <MainRoutes/>
        <Snackbar />
        {spinner && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <CircularProgress />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ screenConfiguration }) => {
  const { preparedFinalObject = {} } = screenConfiguration;
  const { spinner } = preparedFinalObject;
  return { spinner };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(App));
