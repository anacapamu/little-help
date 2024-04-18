"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { MessageSchema } from "../util/types";
import MessageItem from "./message-item";

interface Props {
  messages: MessageSchema[];
  currentUserId: string;
}

const MessagesList: React.FC<Props> = ({ messages, currentUserId }) => {
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
          <MessageItem
            message={message}
            preview={true}
            currentUserId={currentUserId}
          />
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
