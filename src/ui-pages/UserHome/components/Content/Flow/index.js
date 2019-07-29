import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import flowComponents from "../../../../../ui-config/flowComponents";

const styles = theme => ({
  root: {
    display: "flex",
    width: "100vw"
  },
  paper: {
    minHeight: "85vh",
    overflow: "scroll",
    display: "flex",
    flexWrap: "wrap"
  },
  content: {
    minHeight: "85vh",
    overflow: "scroll"
  }
});

class Flow extends React.Component {
  state = {
    contentComponents: []
  };

  onDragStart = start => {
    // const homeIndex = start.source.index;
    // this.setState({ homeIndex });
  };

  onDragUpdate = update => {
    // console.log(update);
  };

  onDragEnd = result => {
    // console.log(result);
    this.setState({ homeIndex: 0 });
    const { source, destination } = result;
    let { contentComponents } = this.state;

    // dropped outside the list
    if (
      !destination ||
      destination.droppableId === "flow-droppable-components"
    ) {
      return;
    }
    if (source.droppableId === "flow-droppable-components") {
      // contentComponents.push({...flowComponents[source.index]});
      contentComponents = [...contentComponents, flowComponents[source.index]];
      this.setState({ contentComponents });
    }
    this.setState({ style: { left: "400px", top: "400px" } });
  };

  myOnMouseDown = event => console.log("mouse down on", event.target);

  getContentStyle = (style, snapshot) => {
    console.log(style);
    console.log(snapshot);
    if (!snapshot.isDropAnimating) {
      return style;
    }
    return {
      ...style
    };
  };

  render() {
    const { classes } = this.props;
    const { contentComponents, homeIndex ,style} = this.state;
    const { getContentStyle, myOnMouseDown } = this;
    return (
      <div className={classes.root}>
        <DragDropContext
          onDragEnd={this.onDragEnd}
          onDragStart={this.onDragStart}
          onDragUpdate={this.onDragUpdate}
        >
          <Grid container>
            <Droppable
              droppableId="flow-droppable-components"
              isDropDisabled={true}
            >
              {provided => (
                <Grid item xs={12} md={3}>
                  <Paper
                    classes={{ root: classes.paper }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {flowComponents.map((component, key) => {
                      return (
                        <Draggable
                          draggableId={`flow-components-${key}`}
                          index={key}
                          key={key}
                        >
                          {provided => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <img src={component.icon} alt={component.name} />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  </Paper>
                  {provided.placeholder}
                </Grid>
              )}
            </Droppable>
            <Droppable droppableId="flow-droppable-content">
              {(provided, snapshot) => (
                <Grid item xs={12} md={9}>
                  <div
                    className={classes.content}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {contentComponents.map((component, key) => {
                      return (
                        <Draggable
                          draggableId={`flow-content-${key}`}
                          index={key}
                          key={key}
                        >
                          {(provided, snapshot) => {
                            // const onMouseDown = (() => {
                            //   // dragHandleProps might be null
                            //   if (!provided.dragHandleProps) {
                            //     return onMouseDown;
                            //   }
                            //   console.log(provided.dragHandleProps);
                            //   // creating a new onMouseDown function that calls myOnMouseDown as well as the drag handle one.
                            //   return event => {
                            //     provided.dragHandleProps.onMouseDown(event);
                            //     myOnMouseDown(event);
                            //   };
                            // })();

                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                // onMouseDown={onMouseDown}
                                // onBlur={onMouseDown}
                                // onFocus={onMouseDown}
                                // onKeyDown={onMouseDown}
                                // style={{ width: "154px", height: "175px" }}
                                style={{ ...provided.draggableProps.style }}
                              >
                                <img
                                  src={component.icon}
                                  alt={component.name}
                                />
                              </div>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                  </div>
                  {provided.placeholder}
                </Grid>
              )}
            </Droppable>
          </Grid>
        </DragDropContext>
      </div>
    );
  }
}

export default withStyles(styles)(Flow);
