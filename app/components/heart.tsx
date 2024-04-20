import React from "react";

interface Props {
  color: string;
  style?: React.CSSProperties;
}

const Heart: React.FC<Props> = ({ color, style }) => {
  return <span style={{ color, ...style }}>{"\u2665"}</span>;
};

export default Heart;
