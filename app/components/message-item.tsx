import Link from "next/link";
import React from "react";
import { MessageSchema } from "../util/types";
import Heart from "./heart";

interface Props {
  message: MessageSchema;
  preview?: boolean;
  currentUserId?: string;
}

const MessageItem: React.FC<Props> = ({
  message,
  preview = false,
  currentUserId,
}) => {
  const isCurrentUser = message.sender.id === currentUserId;
  const chatParticipantName = isCurrentUser ? message.receiver.name : message.sender.name;

  const content = preview
    ? (message.content.length > 100 ? `${message.content.substring(0, 100)}...` : message.content)
    : message.content;

  const hasThanks = /thanks|thank you/i.test(message.content) && !isCurrentUser && !preview;

  const timestamp = new Date(message.timestamp);
  const timeStr = `${timestamp.getHours()}:${timestamp.getMinutes().toString().padStart(2, '0')}`;

  const justifyContent = preview ? "flex-start" : (isCurrentUser ? "flex-end" : "flex-start");
  const bgColorClass = preview ? "bg-gray-100 dark:bg-gray-900" : (isCurrentUser ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-gray-900");
  const borderRadiusClass = preview ? "rounded-lg" : (isCurrentUser ? "rounded-tr-none" : "rounded-tl-none");

  return (
    <Link href={`/conversation/${message.conversationId}`}>
      <div style={{ display: "flex", alignItems: "center", justifyContent }}>
        {preview && <h4>{chatParticipantName}</h4>}
        <div className={`flex flex-col items-start max-w-[75%]`}>
          <p className={`${borderRadiusClass} ${bgColorClass} p-4 text-sm break-words`}>
            {content} {hasThanks && <Heart color="red" />}
          </p>
          <p className="text-xs text-gray-500 mt-1">{timeStr}</p>
        </div>
      </div>
    </Link>
  );
};

export default MessageItem;
