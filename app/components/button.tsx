import React from "react";

interface Props {
  text?: string;
  buttonColor: string;
  textColor?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<Props> = ({
  buttonColor,
  textColor,
  onClick,
  text,
  style,
  children,
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
      {text || children}
    </button>
  );
};

export default Button;
