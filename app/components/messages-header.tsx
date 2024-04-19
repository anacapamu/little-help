import React from "react";
import Button from "./button";

interface Props {
  backgroundColor: string;
}

const MessagesHeader: React.FC<Props> = ({ backgroundColor }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: backgroundColor,
        padding: "10px 20px",
      }}
    >
      <Button
        buttonColor="transparent"
        textColor="white"
        text="Edit"
        onClick={() => {
          console.log("Edit clicked"); // TODO: add edit function
        }}
      />
      <h1 style={{ margin: 0, color: "white", fontWeight: "bold" }}>
        Messages
      </h1>
      <Button
        buttonColor="transparent"
        iconSrc="/whiteComposeIcon.png"
        onClick={() => {
          console.log("Compose clicked"); // TODO: add compose function
        }}
      />
    </div>
  );
};

export default MessagesHeader;
