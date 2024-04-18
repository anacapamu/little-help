"use client";

import React, { useEffect, useState } from "react";
import MessagesList from "./components/messages-list";
import { MessageSchema, ConversationSchema } from "./util/types";

export default function Home() {
    const [messages, setMessages] = useState<MessageSchema[]>([]);
    const currentUserId = "u1"; // TODO: dynamically set based on the authenticated user

    useEffect(() => {
        const fetchConversations = async () => {
            const convResponse = await fetch(`/api/list-conversations?userId=${currentUserId}`);
            if (convResponse.ok) {
                const conversations: ConversationSchema[] = await convResponse.json();
                const messagePromises = conversations.map(async (conv: ConversationSchema) => {
                    const msgResponse = await fetch(`/api/read-conversation?conversationId=${conv.conversationId}&currentUserId=${currentUserId}`);
                    const msgData = await msgResponse.json();
                    if (msgData.messages && msgData.messages.length > 0) {
                        return msgData.messages[msgData.messages.length - 1];
                    }
                    return undefined;
                });
                const latestMessages = await Promise.all(messagePromises);
                setMessages(latestMessages.filter(msg => msg)); // Filter out undefined results
            } else {
                console.error("Failed to fetch conversations");
            }
        };

        fetchConversations();
    }, [currentUserId]);

    return <MessagesList messages={messages} currentUserId={currentUserId}/>;
}
