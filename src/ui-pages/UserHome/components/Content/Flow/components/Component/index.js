import React from "react";
import { useDrag } from "react-dnd";

const Component = ({
  id = "",
  index,
  left = 0,
  top = 0,
  copyComponent = false,
  cursor,
  component
}) => {
  const [{ isDragging }, drag] = useDrag({
    item: { index, left, top, copyComponent, type: `component` },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div style={{ position: "relative" }}>
      <div id={copyComponent ? id : `component-${index}`} ref={!copyComponent?drag:null}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        position: copyComponent ? "absolute" : "relative",
        top,
        left
      }}>
        <img
          src={component.icon}
          alt={component.name}
        />
      </div>
    </div>
  );
};

export default Component;
