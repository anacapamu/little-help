import React from "react";

interface Props {
  color: string;
}

const Heart: React.FC<Props> = ({ color }) => {
  return <span style={{ color }}>{"\u2665"}</span>;
};

export default Heart;
