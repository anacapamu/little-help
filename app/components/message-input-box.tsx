import React, { useState } from "react";
import Button from "./button";

interface Props {
  placeholder: string;
  onSubmit?: (message: string) => void;
}

const MessageInputBox: React.FC<Props> = ({ placeholder, onSubmit }) => {
  const [message, setMessage] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <Button
        text="Send"
        buttonColor="#fe924d"
        textColor="white"
        onClick={handleSubmit}
      />
    </div>
  );
};

export default MessageInputBox;
