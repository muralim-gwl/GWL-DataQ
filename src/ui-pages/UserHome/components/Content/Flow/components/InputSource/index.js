import React from "react";
import NativeSelect from "@material-ui/core/NativeSelect";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Select from "react-select";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import DataSourceTable from "../../../../../../../ui-containers/dataSourceTable";
import FilterTable from "../../../../../../../ui-containers/filterTable";
import { withStyles } from "@material-ui/core/styles";
import { mapDispatchToProps } from "../../../../../../../ui-utils/commons";
import { httpRequest } from "../../../../../../../ui-utils/api";
import { connect } from "react-redux";
import "./index.css";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column"
  },
  paper: {
    overflow: "scroll",
    minHeight: "85vh"
  },
  content: {
    minHeight: "85vh",
    width: "100%",
    overflow: "scroll",
    position: "relative"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220
  },
  input: {
    padding: "10px 14px"
  },
  tabs: {
    position: "fixed",
    zIndex: "1000",
    background: "white",
    width: "100%"
  }
});

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

class InputSource extends React.Component {
  state = {
    containerTab: true,
    dataTab: false,
    columnTab: "",
    table: "",
    filterTab: false,
    connectionName: "",
    selectedTab: 0
  };

  dataColumn = async e => {
    console.log("data column selected", e.value);
    let requestBody = {
      ajax: "get",
      action: "getAllTables",
      connectionName: this.state.connectionName,
      dataBasename: e.value
    };
    const allTablesResponse = await httpRequest({
      endPoint: "/JDBCDeatilsServlet",
      method: "post",
      requestBody
    });
    console.log("get all tablet in this", allTablesResponse);
    this.props.setAppData("dataTableFilter", allTablesResponse);
    this.setState({ filterTab: true });
  };

  handleDropDown = name => async event => {
    if (name === "table") {
      this.setState({
        ...this.state,
        [name]: event.target.value,
        connectionName: event.target.value
      });
      const { setAppData } = this.props;
      let requestBody = {
        ajax: "get",
        action: "getAllSchemas",
        connectionName: event.target.value
      };
      const allDatabaseResponse = await httpRequest({
        endPoint: "/JDBCDeatilsServlet",
        method: "post",
        requestBody
      });
      setAppData("columnFilter", allDatabaseResponse);
    }
    if (name === "columnTab") {
      this.setState({
        ...this.state,
        [name]: event.target.value
      });
    }
  };

  handleChange = (event, newValue) => {
    this.setState({
      selectedTab: newValue
    });
  };

  render() {
    const {
      classes,
      connections,
      columnFilter,
      dataDropDown,
      dataTableFilter
    } = this.props;
    const { handleChange } = this;
    const { columnTab, table, filterTab, selectedTab } = this.state;
    const options = [];
    columnFilter.length > 0 &&
      columnFilter.map(item => options.push({ value: item, label: item }));
    return (
      <div className={classes.root}>
        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          onChange={handleChange}
          aria-label="simple tabs example"
          classes={{ root: classes.tabs }}
        >
          <Tab label="Config" {...a11yProps(0)} />
          <Tab label="Data" {...a11yProps(1)} />
        </Tabs>
        <div
          style={{ marginTop: "48px" }}
          className={selectedTab === 0 ? "show" : "hide"}
        >
          <div className="displayHeader">
            Select Data source which will connect jobs with it
          </div>
          <div className="subContainerDisplay">
            <div className="subTab">Select</div>
            {/* <button onClick={this.showFilterTable}>Data Source Connection</button> */}
            <FormControl variant="outlined" className={classes.formControl}>
              <NativeSelect
                className={classes.selectEmpty}
                value={table}
                name="table"
                onChange={this.handleDropDown("table")}
                input={<OutlinedInput classes={{ input: classes.input }} />}
              >
                <option value="" disabled>
                  Data Source Connection
                </option>
                {connections.length > 0 &&
                  connections.map((item, index) => (
                    <option key={index} value={item.connectionName}>
                      {item.connectionName}
                    </option>
                  ))}
              </NativeSelect>
            </FormControl>
            <Select options={options} onChange={this.dataColumn} />
          </div>

          {filterTab && <FilterTable dataTableFilter={dataTableFilter} />}
        </div>
        <div
          style={{ marginTop: "48px" }}
          className={selectedTab === 1 ? "show" : "hide"}
        >
          <div className="dataDisplayTab">
            <span>Search Table</span>
            <FormControl variant="outlined" className={classes.formControl}>
              <NativeSelect
                className={classes.selectEmpty}
                value={columnTab}
                name="columnTab"
                onChange={this.handleDropDown("columnTab")}
                input={<OutlinedInput classes={{ input: classes.input }} />}
              >
                <option value="" disabled>
                  Select Table
                </option>
                {dataDropDown.length > 0 &&
                  dataDropDown.map((item, i) => (
                    <option value={item} key={i}>
                      {item}
                    </option>
                  ))}
              </NativeSelect>
            </FormControl>
            <span>
              {dataDropDown.length > 0
                ? dataDropDown.length + " Tables"
                : "0 Tables"}{" "}
            </span>
          </div>
          <DataSourceTable />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ screenConfiguration = {} }) => {
  const { preparedFinalObject = {} } = screenConfiguration;
  const {
    connections = [],
    columnFilter = [],
    dataDropDown = [],
    dataTableFilter = []
  } = preparedFinalObject;
  return {
    connections,
    columnFilter,
    dataDropDown,
    dataTableFilter
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(InputSource));
