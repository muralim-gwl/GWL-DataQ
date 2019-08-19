import React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import flowComponents from "../../../../../ui-config/flowComponents";
import Component from "./components/Component";
import DropLocation from "./components/DropLocation";
import jsplumb from "jsplumb";
import $ from "jquery";
import { mapDispatchToProps} from "../../../../../ui-utils/commons";
import { httpRequest} from "../../../../../ui-utils/api";
import { connect } from "react-redux";
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
    minHeight: "85vh",
    zIndex:"2"
  },
  content: {
    minHeight: "85vh",
    // width: "100vw",
    // overflow: "scroll",
    position: "relative"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220
  },
  input: {
    padding: "10px 14px"
  },
  dataContainer: {
    position: "fixed",
    bottom: 0,
    background: "white",
    width: "100%",
    height:"45%",
    overflow:"scroll",
    zIndex:"3"
  }
});

var hasNew = false;
var previousLength = -1;

class Flow extends React.Component {
  state = {
    copyFlowComponents: [],
    type: null,
    openComponentPopop: false
  };

  moveComponent = (index, top, left, copyComponent) => {
    let { copyFlowComponents = [] } = this.state;
    if (copyComponent) {
      hasNew = false;
      copyFlowComponents[index] = {
        ...copyFlowComponents[index],
        top,
        left
      };
    } else {
      this.setSelectedComponent(flowComponents[index].type);
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

  componentDidMount = async () => {
    firstInstance.setContainer(document.getElementById("drop-location"));
    const { setAppData } = this.props;
    let requestBody = {
      ajax: "getAll"
    };
    const allConnectionResponse = await httpRequest({
      endPoint: "/jdbcdataservlet",
      method: "post",
      requestBody
    });
    console.log("get all connection", allConnectionResponse);
    setAppData("connections", allConnectionResponse);
  };

  componentDidUpdate() {
    let { copyFlowComponents = [] } = this.state;
    if (copyFlowComponents.length > 0 && hasNew) {
      const {
        hasInput = false,
        hasOutput = false,
        maxConnections = 1
      } = copyFlowComponents[previousLength];
      const common = {
        isSource: hasOutput,
        isTarget: hasInput,
        connector: "Flowchart",
        connectorOverlays: [
          ["Arrow", { location: 1 }],
          [
            "Custom",
            {
              create: function(component) {
                return $(
                  '<img style="display:block;background-color:transparent;" src="/assets/images/svg_components/delete connection.svg">'
                );
              },
              location: 0.5,
              cssClass: "delete-connection",
              events: {
                click: function(params) {
                  console.log(params);
                  console.log(firstInstance);
                  firstInstance.deleteConnectionsForElement(
                    params.component.sourceId,
                    params
                  );
                }
              }
            }
          ]
        ],
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
      hasNew = false;
    }
  }

  setSelectedComponent = type => {
    const {openComponentPopop}=this.state;
    this.toggleComponentPopup();
    if (openComponentPopop) {
      this.setState({ type:null });
    }
    else {
      this.setState({ type });
    }
  };

  toggleComponentPopup = () => {
    const { openComponentPopop } = this.state;
    this.setState({ openComponentPopop: !openComponentPopop });
  };

  render() {
    const { classes } = this.props;
    const { copyFlowComponents, type, openComponentPopop } = this.state;
    const { moveComponent, setSelectedComponent } = this;

    const renderComponent = () => {
      if (type) {
        const Component = require(`./components/${type}`).default;
        return <Component />;
      } else {
        return <div>No configuration</div>;
      }
    };

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
                setSelectedComponent={setSelectedComponent}
              />
            </Grid>
          </Grid>
        </DndProvider>
        {openComponentPopop && (
          <div className={classes.dataContainer}>{renderComponent()}</div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ screenConfiguration = {} }) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Flow));
