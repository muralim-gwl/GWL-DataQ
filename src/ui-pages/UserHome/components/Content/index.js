import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import Menu from "./components/Menu";
import UserRoutes from "../../../../ui-routes/UserHomeRoutes";

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: "white"
  },
  webHeader:{
    display:"flex",
    alignItems:"center",
    justifyContent:"left",
    flexGrow: 1
  },
  avatar:{
    marginRight:"16px"
  },
  content:{
    display: "flex",
    width:"100%",
    margin:"88px 8px 8px 8px"
  }
});

class MiniDrawer extends React.Component {
  state = {
    open: false
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes,history} = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classes.appBar}
        >
          <Toolbar>
            <div classes={{root:classes.webHeader}}>
                <img src="/assets/images/svg_components/logo-1.svg" alt="logo"/>
            </div>
            <Menu history={history}/>
            {/*<Avatar
              alt="Remy Sharp"
              src="https://firebasestorage.googleapis.com/v0/b/mihy-all.appspot.com/o/WhatsApp%20Image%202019-02-23%20at%209.37.56%20PM.jpeg?alt=media&token=fa3d29e1-7dc2-429e-89b1-b9aa677ea91d"
              className={classes.avatar}
            />*/}
            <Button onClick={(e)=>{
              window.localStorage.clear();
              history.push("/")
              window.location.reload()
            }}>Logout</Button>
          </Toolbar>
        </AppBar>
        <div className={classes.content}>
          <UserRoutes/>
        </div>
      </div>
    );
  }
}

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

const mapStateToProps = ({ screenConfiguration }) => {
  const { preparedFinalObject = {} } = screenConfiguration;
  const {
    userInfo = {}
  } = preparedFinalObject;
  const { user = {} } = userInfo;
  return {user };
};



export default withRouter(withStyles(styles, { withTheme: true })(connect(mapStateToProps,null)(MiniDrawer)));
