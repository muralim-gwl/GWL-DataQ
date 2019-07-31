import React from "react";
import { useDrag } from "react-dnd";

const Component = ({index, left=0, top=0,copyComponent=false,cursor, component}) => {
  const [{ isDragging }, drag] = useDrag({
    item: { index, left, top,copyComponent,type: `component` },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div>
      <img
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: "move",
          position:copyComponent?"absolute":"relative",
          top,
          left
        }}
        src={component.icon}
        alt={component.name}
      />
    </div>
  );
};

export default Component;
