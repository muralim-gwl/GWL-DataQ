import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Select from "react-select";
//import "react-select/dist/react-select.css";
import { withStyles } from "@material-ui/core/styles";
import { mapDispatchToProps } from "../../../../../../../ui-utils/commons";
import { httpRequest } from "../../../../../../../ui-utils/api";
import { connect } from "react-redux";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    background: "white"
  },
  header: {
    marginLeft: "1%",
    color: "#cacaca",
    fontWeight: "600"
  },
  inputTab: {
    width: "21%",
    margin: "1%"
  },
  inputLabel: {
    paddingBottom: "4%",
    display: "block"
  },
  dataContainer: {
    display: "flex"
  },
  addImage: {
    marginTop: "3.3%",
    cursor: "pointer",
    marginLeft: "1%"
  }
});

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

class DataCompare extends React.Component {
  state = {
    selectedTab: 0,
    multiValue1: [],
    filterOptions1: [
      { value: "myTable", label: "myTable" },
      { value: "Table2", label: "Table2" },
      { value: "Table3", label: "Table3" }
    ],
    filterOptions2: [
        { value: "myTable2", label: "myTable2" },
        { value: "Table23", label: "Table23" },
        { value: "Table32", label: "Table32" }
    ]
    };


 

  handleChange = (event, newValue) => {
    this.setState({
      selectedTab: newValue
    });
  };
  handleMultiChange1 = (option) => {
    this.setState(state => {
      return {
        multiValue1: option
      };
    });
  }
  handleMultiChange2 = (option) => {
    this.setState(state => {
      return {
        multiValue2: option
      };
    });
  }
 
  render() {
    const {
      classes
    } = this.props;
    const { handleChange } = this;
    const { selectedTab } = this.state;
    return (
      <div className={classes.root}>
        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          onChange={handleChange}
          aria-label="simple tabs example"
          classes={{ root: classes.tabs }}
        >
          <Tab label="Mapping" {...a11yProps(0)} />
          <Tab label="Compare" {...a11yProps(1)} />
          <Tab label="Results" {...a11yProps(2)} />
        </Tabs>
        <div
          style={{ marginTop: "48px" }}
          className={selectedTab === 0 ? "show" : "hide"}
        >
          <div className={classes.header}>Select Tables Which Will Compare Them</div>
          <div className={classes.dataContainer}>
            <div className={classes.inputTab}>
                <label className={classes.inputLabel}>Input source 1</label>
                <Select
                    name="Table Name 1"
                    placeholder="Table Name"
                    value={this.state.multiValue1}
                    options={this.state.filterOptions1}
                    onChange={this.handleMultiChange1}
                    isMulti
                />
            </div>
            <div className={classes.inputTab}>
                <label className={classes.inputLabel}>Input source 2</label>
                <Select
                    name="Table Name 2"
                    placeholder="Table Name"
                    value={this.state.multiValue2}
                    options={this.state.filterOptions2}
                    onChange={this.handleMultiChange2}
                    isMulti
                />
            </div>
            <div className={classes.addImage}>
                <img style={{ width: "70%" }} src='/assets/images/svg_components/add-icon.svg' alt='add' />
            </div>
          </div>
        </div>
        <div
          style={{ marginTop: "48px" }}
          className={selectedTab === 1 ? "show" : "hide"}
        >
          This is Tab 2
        </div>
        <div
          style={{ marginTop: "48px" }}
          className={selectedTab === 2 ? "show" : "hide"}
        >
          This is Tab 3
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
)(withStyles(styles)(DataCompare));
