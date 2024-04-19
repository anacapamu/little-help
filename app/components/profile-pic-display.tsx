import Image from "next/image";
import React from "react";

interface Props {
  src: string;
  size: number;
  borderColor: string;
}

const ProfilePicDisplay: React.FC<Props> = ({ src, size, borderColor }) => {
  return (
    <Image
      alt="Profile Picture"
      className={`rounded-full ${borderColor} border-2 dashed`}
      src={src}
      height={size}
      width={size}
      style={{
        aspectRatio: "1",
        objectFit: "cover",
      }}
    />
  );
};

export default ProfilePicDisplay;
