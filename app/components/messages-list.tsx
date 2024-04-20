"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MessageSchema } from "../util/types";
import MessageItem from "./message-item";
import ProfilePicDisplay from "./profile-pic-display";
import UserNameDisplay from "./user-name-display";

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
            className="flex items-center space-x-4 p-4"
            key={message.id}
            onClick={() => handleSelectMessage(message.conversationId)}
            style={{ cursor: "pointer", alignItems: "flex-start" }}
          >
            <ProfilePicDisplay
              src={profilePics[participantId] || "/defaultProfilePic.png"}
              borderColor="border-gray-900"
              size={50}
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-2">
                <UserNameDisplay
                  userName={
                    message.sender.id === currentUserId
                      ? message.receiver.name
                      : message.sender.name
                  }
                  companyName="Barre Client"
                  style={{ fontSize: "14px", fontWeight: "600" }}
                />
                <div className="text-xs text-gray-600">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
              <MessageItem
                message={message}
                preview={true}
                currentUserId={currentUserId}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesList;
