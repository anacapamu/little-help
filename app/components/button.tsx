import React from "react";

interface Props {
  text: string;
  buttonColor: string;
  textColor?: string;
  onClick: () => void;
}

const Button: React.FC<Props> = ({ buttonColor, textColor, onClick, text }) => {
  return (
    <button
      style={{
        backgroundColor: buttonColor,
        color: textColor,
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
