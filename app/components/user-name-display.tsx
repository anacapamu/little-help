import React from "react";

interface Props {
  userName: string;
  companyName: string;
  style?: React.CSSProperties;
}

const UserNameDisplay: React.FC<Props> = ({ userName, companyName, style }) => {
  return (
    <h2 style={style}>
      {userName} - {companyName}
    </h2>
  );
};

export default UserNameDisplay;
