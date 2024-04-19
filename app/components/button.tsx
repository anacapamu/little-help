import Image from "next/image";
import React from "react";

interface Props {
  text?: string;
  buttonColor: string;
  textColor?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  iconSrc?: string;
  onClick?: () => void;
}

const Button: React.FC<Props> = ({
  buttonColor,
  textColor,
  onClick,
  text,
  style,
  children,
  iconSrc,
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
      {iconSrc && (
        <div style={{ width: 25, height: 25, position: "relative" }}>
          <Image src={iconSrc} alt="icon" layout="fill" objectFit="contain" />
        </div>
      )}
      {text || children}
    </button>
  );
};

export default Button;
