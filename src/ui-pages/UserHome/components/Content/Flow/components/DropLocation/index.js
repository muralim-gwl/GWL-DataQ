import React from "react";
import Component from "../Component";
import { useDrop } from "react-dnd";

const DropLocation = ({
  components,
  classes,
  moveComponent,
  copyFlowComponents = []
}) => {
  const [, drop] = useDrop({
    accept: `component`,
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      moveComponent(item.index, top, left, item.copyComponent);
      return undefined;
    }
  });

  return (
    <div ref={drop} className={classes.root}>
      {copyFlowComponents.map((component, key) => {
        return (
          <Component
            key={key}
            top={component.top}
            left={component.left}
            component={component}
            index={key}
            copyComponent
          />
        );
      })}
    </div>
  );
};

export default DropLocation;
