import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {mapDispatchToProps} from "../../ui-utils/commons";
import {httpRequest} from "../../ui-utils/api";
import {connect} from "react-redux";


const styles = {
  root: {
    display: "flex",
    margin:"100px"
  },
  formCenter:{
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    flexDirection:"column",
    padding:"16px"
  }
};

class Login extends React.Component {

  componentDidMount(){
    const {history,userInfo}=this.props;
    if (userInfo.session_id) {
      history.push("/user-home")
    }
  }

  login=async()=>{
    const {login,setAppData,history}=this.props;
    const requestBody={
        "action":"login",
        "username":login.username,
        "password":login.password
    }
    const loginResponse=await httpRequest({endPoint:"",requestBody});
    let snackbarObj={}
    if(!loginResponse.error) {
      snackbarObj["open"]=true;
      snackbarObj["variant"]="success";
      snackbarObj["message"]="Logged in successfully";
      setAppData("snackbar",snackbarObj);
      setAppData("userInfo",loginResponse);
      window.localStorage.setItem("userInfo",JSON.stringify(loginResponse));
      history.push("/user-home")
    }
    else {
      snackbarObj["open"]=true;
      snackbarObj["variant"]="error";
      snackbarObj["message"]=loginResponse.error;
      setAppData("snackbar",snackbarObj);
    }
  }



  render() {
    const { classes, setAppData, username } = this.props;
    const {login}=this;
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Paper classes={{root:classes.formCenter}}>
            Login
            <br />
            <TextField
              id="standard-name"
              label="Username"
              value={username}
              onChange={e => setAppData("login.username", e.target.value)}
              margin="normal"
            />
            <br />
            <TextField
              id="standard-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              margin="normal"
              onChange={e => setAppData("login.password", e.target.value)}
            />
            <br />
            <Button onClick={(e)=>{
              login()
            }} color="primary" variant="contained">Login</Button>
            </Paper>
          </Grid>
          <Grid item md={4}></Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps=({screenConfiguration={}})=>{
  const {preparedFinalObject={}}=screenConfiguration
  const {login={},userInfo={}}=preparedFinalObject;
  return {login,userInfo}
}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Login));
