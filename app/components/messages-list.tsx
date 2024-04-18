"use client";

import { useRouter } from "next/navigation";
import React from "react";
import MessageItem from "./message-item";
import { MessageSchema } from "../util/types";

interface Props {
  messages: MessageSchema[];
}

const MessagesList: React.FC<Props> = ({ messages }) => {
  const router = useRouter();

  const handleSelectMessage = (conversationId: string) => {
    router.push(`/conversation/${conversationId}`);
  };

  return (
    <div>
      {messages.map((message) => (
        <div
          key={message.id}
          onClick={() => handleSelectMessage(message.conversationId)}
          style={{ cursor: "pointer" }}
        >
          <MessageItem message={message} preview={true} />
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
