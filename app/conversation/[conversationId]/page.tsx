"use client";

import Button from "@/app/components/button";
import ProfilePicDisplay from "@/app/components/profile-pic-display";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import MessageInputBox from "../../components/message-input-box";
import MessageItem from "../../components/message-item";
import { MessageSchema } from "../../util/types";

const Conversation: React.FC = () => {
  const [messages, setMessages] = useState<MessageSchema[]>([]);
  const [chatParticipantName, setChatParticipantName] = useState<string>("");
  const [profilePicUrl, setProfilePicUrl] = useState<string>(
    "/defaultProfilePic.png",
  );
  const [chatParticipantId, setChatParticipantId] = useState<string>("");
  const [littleHelpOn, setLittleHelpOn] = useState(true);
  const { conversationId } = useParams();
  const currentUserId = "u1"; // TODO: dynamically set based on the authenticated user

  useEffect(() => {
    if (typeof conversationId === "string") {
      fetchMessages(conversationId);
    }
  }, [conversationId]);

  const fetchMessages = async (id: string) => {
    try {
      const response = await fetch(
        `/api/read-conversation?conversationId=${id}&currentUserId=${currentUserId}`,
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setMessages(data.messages);
      if (data.messages.length > 0) {
        const firstMessage = data.messages[0];
        const isCurrentUserSender = firstMessage.sender.id === currentUserId;
        const participant = isCurrentUserSender
          ? firstMessage.receiver
          : firstMessage.sender;
        setChatParticipantName(participant.name);
        setChatParticipantId(participant.id);
        fetchParticipantDetails(participant.id);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setChatParticipantName("Error loading messages");
    }
  };

  const fetchParticipantDetails = async (participantId: string) => {
    try {
      const response = await fetch(
        `/api/get-user-details?userId=${participantId}`,
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const userDetails = await response.json();
      setProfilePicUrl(userDetails.profilePicUrl);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (content.trim() === "") return; // Prevent sending empty messages
    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: chatParticipantId,
          content: content,
        }),
      });
      const newMessage = await response.json();
      if (response.ok) {
        setMessages([...messages, newMessage]); // Add new message to the local state to update UI
      } else {
        console.error("Failed to send message:", newMessage);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const toggleLittleHelp = () => {
    setLittleHelpOn(!littleHelpOn); // TODO: add logic to stop AI from responding
  };

  return (
    <div className="flex flex-col h-full min-h-screen rounded-t-xl overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" passHref>
            <Button
              text="<"
              buttonColor="transparent"
              textColor="#f2884b"
              style={{ fontSize: "24px", lineHeight: "64px" }}
            />
          </Link>
          <div className="flex-1 flex justify-center">
            <ProfilePicDisplay
              src={profilePicUrl}
              borderColor="border-gray-300"
              size={64}
            />
          </div>
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
          />
        ))}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex flex-col items-center space-y-4">
        <MessageInputBox
          placeholder="Message"
          onSubmit={handleSendMessage}
          disabled={littleHelpOn}
        />
        <Button
          onClick={toggleLittleHelp}
          buttonColor="transparent"
          textColor="#f2884b"
        >
          <span className="font-semibold italic">Little Help</span>
          <span>{` is turned ${littleHelpOn ? "on" : "off"}. Click to switch ${littleHelpOn ? "off" : "on"}.`}</span>
        </Button>
      </div>
    </div>
  );
};

export default Conversation;
