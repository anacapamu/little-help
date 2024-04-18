"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import MessageItem from "../../components/message-item";
import { MessageSchema } from "../../util/types";

const Conversation: React.FC = () => {
  const [messages, setMessages] = useState<MessageSchema[]>([]);
  const [chatParticipantName, setChatParticipantName] = useState<string>("");
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");
  const { conversationId } = useParams();
  const currentUserId = "u1"; // TODO: dynamically set based on the authenticated user

  useEffect(() => {
    if (typeof conversationId === "string") {
      fetchMessages(conversationId);
    }
  }, [conversationId]);

  const fetchMessages = async (id: string) => {
    try {
      const response = await fetch(`/api/read-conversation?conversationId=${id}&currentUserId=${currentUserId}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const { messages, otherParticipantId } = await response.json();
      setMessages(messages);
      fetchParticipantDetails(otherParticipantId);
    } catch (error) {
      console.error("Fetch error:", error);
      setChatParticipantName("Error loading messages");
    }
  };

  const fetchParticipantDetails = async (participantId: string) => {
    try {
      const response = await fetch(`/api/get-user-details?userId=${participantId}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const { userName, profilePicUrl } = await response.json();
      setChatParticipantName(userName);
      setProfilePicUrl(profilePicUrl);
    } catch (error) {
      console.error("Fetch error:", error);
      setChatParticipantName("No Name");
      setProfilePicUrl("/../../../public/errorProfilePic.png");
    }
  };

  return (
    <div className="flex flex-col h-[400px] rounded-t-xl overflow-y-auto bg-gray-50 dark:bg-gray-950 px-8 py-4">
      <div className="flex items-center justify-center">
        <Image
          alt="Profile Picture"
          className="rounded-full border-dashed border-2 border-gray-300"
          height={64}
          src={profilePicUrl}
          style={{
            aspectRatio: "64/64",
            objectFit: "cover",
          }}
          width={64}
        />
      </div>
      <div className="font-semibold text-lg text-center py-2">
        <h2>{chatParticipantName || "Loading..."} - Barre Client</h2>
      </div>
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          preview={false}
          currentUserId={currentUserId}
        />)
      )}
    </div>
  );
};

export default Conversation;
