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
import Select from 'react-select';
import jsplumb from "jsplumb";
import $ from "jquery"
import './dashboard.css';
import DataSourceTable from '../../../../../ui-containers/dataSourceTable';
import FilterTable from '../../../../../ui-containers/filterTable';
import {mapDispatchToProps} from "../../../../../ui-utils/commons";
import {httpRequest} from "../../../../../ui-utils/api";
import {connect} from "react-redux";

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
    width:"100%",
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
    filterTab:false,
    connectionName:''
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

  componentDidMount=async()=> {
    const { setAppData } = this.props;
    firstInstance.setContainer(document.getElementById("drop-location"));
    let requestBody={
      ajax:"getAll"
    };
    const allConnectionResponse=await httpRequest({endPoint:"/jdbcdataservlet",method:"post",requestBody});
    console.log("get all connection",allConnectionResponse);
    setAppData('connections', allConnectionResponse);

    // requestBody={
    //   ajax:"get",
    //   action:"getAllSchemas",
    //   connectionName:"my_table"
    // };
    // const allDatabaseResponse=await httpRequest({endPoint:"/JDBCDeatilsServlet",method:"post",requestBody});
    // console.log("get all database tables",allDatabaseResponse);

    requestBody={
      ajax:"get",
      action:"getAllTables",
      connectionName:"my_table3",
      dataBasename:"dataq"
    };
    const allTablesResponse=await httpRequest({endPoint:"/JDBCDeatilsServlet",method:"post",requestBody});
    console.log("get all tables",allTablesResponse);

    requestBody={
      ajax:"get",
      action:"getAllColumns",
      connectionName:"my_table",
      dataBaseName:"dataq",
      table:"projects"
    };
    const allSampleResponse=await httpRequest({endPoint:"/JDBCDeatilsServlet",method:"post",requestBody});
    console.log("get sample data",allSampleResponse);
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

  dataColumn = async (e)=>{
    console.log('data column selected', e.value);
    let requestBody={
      ajax:"get",
      action:"getAllTables",
      connectionName:this.state.connectionName,
      dataBasename:e.value
    };
    const allTablesResponse=await httpRequest({endPoint:"/JDBCDeatilsServlet",method:"post",requestBody});
    console.log("get all tablet in this",allTablesResponse);
    this.props.setAppData('dataTableFilter', allTablesResponse );
    this.setState({filterTab:true})
  }

  handleDropDown = name => async event =>{
    if(name=='table'){
      this.setState({
        ...this.state,
        [name]: event.target.value,
        connectionName:event.target.value
      });
        const { setAppData } = this.props;
        let requestBody={
          ajax:"get",
          action:"getAllSchemas",
          connectionName:event.target.value,
        };
        const allDatabaseResponse=await httpRequest({endPoint:"/JDBCDeatilsServlet",method:"post",requestBody});
        setAppData('columnFilter', allDatabaseResponse );

    }
    if(name=='columnTab'){
      this.setState({
        ...this.state,
        [name]: event.target.value,
      });
    }
  };

  render() {
    const { classes, connections, columnFilter, dataDropDown, dataTableFilter } = this.props;
    const { copyFlowComponents, containerTab, dataTab, columnTab, table, filterTab } = this.state;
    const { moveComponent, showData, showConfig } = this;
    const options = [];
    columnFilter.length>0 && columnFilter.map(item => options.push({value:item, label:item}));
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
                {connections.length>0 &&
                  connections.map(item=> <option value={item.connectionName}>{item.connectionName}</option>)}
              </NativeSelect>
              </FormControl>
              <Select options={options} onChange={this.dataColumn}/>
            </div>

            {filterTab ? <FilterTable dataTableFilter={dataTableFilter}/>:''}
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
                {dataDropDown.length>0 && dataDropDown.map((item,i)=>
                  <option value={item} key={i}>{item}</option>
                )}
              </NativeSelect>
              </FormControl>
              <span>{dataDropDown.length>0? dataDropDown.length + ' Tables': '0 Tables'} </span>
            </div>
            <DataSourceTable />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps=({screenConfiguration={}})=>{
  const {preparedFinalObject={}}=screenConfiguration;
  const {connections={},columnFilter={},dataDropDown={},dataTableFilter={}}=preparedFinalObject;
  return {
    connections, columnFilter, dataDropDown, dataTableFilter
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Flow));
