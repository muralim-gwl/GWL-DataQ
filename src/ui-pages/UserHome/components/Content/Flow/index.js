import React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { makeStyles } from '@material-ui/core/styles';
import flowComponents from "../../../../../ui-config/flowComponents";
import Component from "./components/Component";
import DropLocation from "./components/DropLocation";
import jsplumb from "jsplumb";
import $ from "jquery"
import './dashboard.css';
import DataSourceTable from '../../../../../ui-containers/dataSourceTable';
import FilterTable from '../../../../../ui-containers/filterTable';
const { jsPlumb } = jsplumb;
const firstInstance = jsPlumb.getInstance();

export const ItemTypes = {
  COMPONENT: "component"
};

const styles = theme => ({
  root: {
    display: "flex"
    // width: "100vw"
  },
  paper: {
    overflow: "scroll",
    minHeight: "85vh"
  },
  content: {
    minHeight: "85vh",
    overflow: "scroll",
    position: "relative"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220,
  },
  input: {
    padding: "10px 14px"
  }
});


var hasNew = false;
var previousLength = -1;

class Flow extends React.Component {
  state = {
    copyFlowComponents: [],
    containerTab:true,
    dataTab:false,
    columnTab:'',
    table:'',
    filterTab:false
  };
  

  moveComponent = (index, top, left, copyComponent) => {
    let { copyFlowComponents = [] } = this.state;
    if (copyComponent) {
      hasNew=false;
      copyFlowComponents[index] = {
        ...copyFlowComponents[index],
        top,
        left
      };
    } else {
      hasNew = true;
      previousLength = copyFlowComponents.length;
      copyFlowComponents.push({
        ...flowComponents[index],
        top,
        left
      });
    }
    this.setState({
      copyFlowComponents
    });
  };

  componentDidMount() {
    firstInstance.setContainer(document.getElementById("drop-location"));
  }

  componentDidUpdate() {
    let { copyFlowComponents = [] } = this.state;
    if (copyFlowComponents.length > 0 && hasNew) {
      const {hasInput=false,hasOutput=false,maxConnections=1}=copyFlowComponents[previousLength]

      const common = {
              isSource: hasOutput,
              isTarget: hasInput,
              connector: "Flowchart",
              connectorOverlays: [  [ "Arrow", {location:1 } ], ["Custom", {
                    create: function (component) {
                        return $('<img style="display:block;background-color:transparent;" src="/assets/images/svg_components/delete connection.svg">');
                    },
                    location: 0.5,
                    cssClass: 'delete-connection',
                    events:{
                        click:function(params) {
                            console.log(params);
                            console.log(firstInstance);
                            firstInstance.deleteConnectionsForElement(params.component.sourceId,params);
                        }
                    }
                }]
              ]
       ,
              maxConnections
      };
      firstInstance.draggable(`copy-component-${previousLength}`);
      if (hasOutput) {
        firstInstance.addEndpoint(
          `copy-component-${previousLength}`,
          { anchor: "Right" },
          common
        );
      }
      if (hasInput) {
        // common.endpoint=["Image",{ src:"" }];
        // common.endpoint="Rectangle";
        firstInstance.addEndpoint(
          `copy-component-${previousLength}`,
          { anchor: "Left" },
          common
        );
      }


    }
  }
  // showFilterTable=()=>{
  //   this.setState({
  //     filterTab:this.state.filterTab
  //   })
  // }

  showConfig=()=>{
    this.setState({
      containerTab:true,
      dataTab:false
    });
  }
  
  showData=()=>{
    this.setState({
      containerTab:false,
      dataTab:true
    });
  }
  handleDropDown = name => event => {
    this.setState({
      ...this.state,
      [name]: event.target.value,
    });
    if(name=='table'){
      this.setState({filterTab:true})
    }
  };

  render() {
    const { classes } = this.props;
    const { copyFlowComponents, containerTab, dataTab, columnTab, table, filterTab } = this.state;
    const { moveComponent, showData, showConfig } = this;
    return (
      <div className={classes.root}>
        <DndProvider backend={HTML5Backend}>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="stretch"
          >
            <Grid item xs={12} md={3}>
              <Paper classes={{ root: classes.paper }}>
                <Grid container>
                  {flowComponents.map((component, key) => {
                    return (
                      <Grid key={key} item xs={6}>
                        <Component component={component} index={key} />
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={9}>
              <DropLocation
                components={copyFlowComponents}
                classes={{ root: classes.content }}
                copyFlowComponents={copyFlowComponents}
                moveComponent={moveComponent}
              />
            </Grid>
          </Grid>
        </DndProvider>
        <div className='dataContainer'>
          <div className='containerTab'>
             <div onClick={showConfig} className={containerTab?'configureTab active':'configureTab inactive'}>Configure</div>
             <div onClick={showData} className={dataTab?'dataTab active':'dataTab inactive'}>Data</div>
          </div>
          <div className={containerTab?'show containerDisplay' :'hide'}>
            <div className='displayHeader'>Select Data source which will connect jobs with it</div>
            <div className='subContainerDisplay'>
              <div className='subTab'>Select</div>
              {/* <button onClick={this.showFilterTable}>Data Source Connection</button> */}
              <FormControl variant="outlined"  className={classes.formControl}>
              <NativeSelect 
                className={classes.selectEmpty}
                value={table}
                name="table"
                onChange={this.handleDropDown('table')}
                input={
                  <OutlinedInput classes={{ input: classes.input }} />
                }
                
              >
                <option value="" disabled>
                  Data Source Connection
                </option>
                <option value={10}>Table 1</option>
                <option value={20}>Table 2</option>
                <option value={30}>Table 3</option>
              </NativeSelect>
              </FormControl>
            </div>
            {filterTab ? <FilterTable />:''}
          </div>
          <div className={dataTab?'show':'hide'}>
            <div className='dataDisplayTab'>
              <span>Search Table</span>
              <FormControl variant="outlined"  className={classes.formControl}>
              <NativeSelect 
                className={classes.selectEmpty}
                value={columnTab}
                name="columnTab"
                onChange={this.handleDropDown('columnTab')}
                input={
                  <OutlinedInput classes={{ input: classes.input }} />
                }
                
              >
                <option value="" disabled>
                  Select Table
                </option>
                <option value={10}>T</option>
                <option value={20}>Twenty</option>
                <option value={30}>Thirty</option>
              </NativeSelect>
              </FormControl>
              <span>20 Tables</span>
            </div>
            <DataSourceTable />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Flow);
