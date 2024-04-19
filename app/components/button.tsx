import React from "react";

interface Props {
  text: string;
  buttonColor: string;
  textColor?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Button: React.FC<Props> = ({
  buttonColor,
  textColor,
  onClick,
  text,
  style,
}) => {
  return (
    <button
      style={{
        backgroundColor: buttonColor,
        color: textColor,
        ...style,
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
