import React from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    display:"flex",
    width:"100%"
  },
};

class Login extends React.Component {
  render() {
    const { classes, ...rest } = this.props;
    return (
      <div className={classes.root}>
        Login
      </div>
    );
  }
}

export default withStyles(styles)(Login);
