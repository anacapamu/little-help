import React, { useState } from "react";
import Button from "./button";

interface Props {
  placeholder: string;
  onSubmit?: (message: string) => void;
  disabled?: boolean;
}

const MessageInputBox: React.FC<Props> = ({
  placeholder,
  onSubmit,
  disabled,
}) => {
  const [message, setMessage] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = () => {
    if (onSubmit && message.trim() !== "") {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-row space-x-4 items-center">
      <textarea
        value={message}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={2}
        cols={50}
        style={{
          borderRadius: "5px",
          border: "2px solid #fe924d",
          padding: "10px",
          resize: "none",
          width: "100%",
          maxWidth: "600px",
        }}
      />
      <Button
        text="Send"
        buttonColor="#fe924d"
        textColor="white"
        onClick={handleSubmit}
        style={{ borderRadius: "5px", padding: "10px 20px" }}
      />
    </div>
  );
};

export default MessageInputBox;
