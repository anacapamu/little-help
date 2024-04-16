import Link from "next/link";
import React from "react";
import { MessageType } from "../util/types";
import Heart from "./heart";

interface Props {
  message: MessageType;
  preview?: boolean;
}

const MessageItem: React.FC<Props> = ({ message, preview = false }) => {
  const content = preview
    ? message.content.length > 100
      ? `${message.content.substring(0, 100)}...`
      : message.content
    : message.content;

  const hasThanks = /thanks|thank you/i.test(message.content); // TODO: add other things to like

  // TODO: adjust timestamp display to show date or relative time (i.e. 2 minutes ago)

  return (
    <Link href={`/conversation/${message.conversationId}`}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {preview ? <h4>{message.sender.name}</h4> : ""}
        <div className="flex flex-col items-start max-w-[75%]">
          <p className="rounded-lg rounded-tl-none bg-gray-100 dark:bg-gray-900 p-4 text-sm break-words">
            {content} {hasThanks && <Heart color="red" />}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MessageItem;
