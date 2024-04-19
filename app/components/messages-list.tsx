"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MessageSchema } from "../util/types";
import MessageItem from "./message-item";
import ProfilePicDisplay from "./profile-pic-display";

interface Props {
  messages: MessageSchema[];
  currentUserId: string;
}

const MessagesList: React.FC<Props> = ({ messages, currentUserId }) => {
  const [profilePics, setProfilePics] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    const uniqueIds = new Set(
      messages.map((message) =>
        message.sender.id === currentUserId
          ? message.receiver.id
          : message.sender.id,
      ),
    );
    uniqueIds.forEach((id) => fetchParticipantDetails(id));
  }, [messages, currentUserId]);

  const fetchParticipantDetails = async (participantId: string) => {
    try {
      const response = await fetch(
        `/api/get-user-details?userId=${participantId}`,
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const userDetails = await response.json();
      setProfilePics((prev) => ({
        ...prev,
        [participantId]: userDetails.profilePicUrl || "/defaultProfilePic.png",
      }));
    } catch (error) {
      console.error("Fetch error:", error);
      setProfilePics((prev) => ({
        ...prev,
        [participantId]: "/defaultProfilePic.png",
      }));
    }
  };

  const handleSelectMessage = (conversationId: string) => {
    router.push(`/conversation/${conversationId}`);
  };

  return (
    <div>
      {messages.map((message) => {
        const participantId =
          message.sender.id === currentUserId
            ? message.receiver.id
            : message.sender.id;
        return (
          <div
            key={message.id}
            onClick={() => handleSelectMessage(message.conversationId)}
            style={{ cursor: "pointer" }}
          >
            <ProfilePicDisplay
              src={profilePics[participantId] || "/defaultProfilePic.png"}
              borderColor="border-gray-900"
              size={45}
            />
            <MessageItem
              message={message}
              preview={true}
              currentUserId={currentUserId}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MessagesList;
