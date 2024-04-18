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

  const uniqueLatestMessages = React.useMemo(() => {
    const messagesMap = new Map();

    messages.forEach((message) => {
      if (
        message.sender.id === currentUserId ||
        message.receiver.id === currentUserId
      ) {
        const key = `${message.sender.id}-${message.conversationId}`;
        const existingMessage = messagesMap.get(key);
        const currentMessageDate = new Date(message.timestamp).getTime();
        const existingMessageDate = existingMessage
          ? new Date(existingMessage.timestamp).getTime()
          : 0;

        if (!existingMessage || existingMessageDate < currentMessageDate) {
          messagesMap.set(key, message);
        }
      }
    });

    return Array.from(messagesMap.values());
  }, [messages, currentUserId]);

  const handleSelectSender = (conversationId: string) => {
    router.push(`/conversation/${conversationId}`);
  };

  return (
    <div>
      {uniqueLatestMessages.map((message) => (
        <div
          key={message.id}
          onClick={() => handleSelectSender(message.conversationId)}
          style={{ cursor: "pointer" }}
        >
          <MessageItem message={message} preview={true} />
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
