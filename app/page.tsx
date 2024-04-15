'use client';

import React, { useEffect, useState } from 'react';
import MessagesList from "./components/messages-list";

export default function Home() {
    const [messages, setMessages] = useState([]);
    const currentUserId = "u1";

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetch(`/api/read-messages?currentUserId=${currentUserId}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                console.error('Failed to fetch messages');
            }
        };

        fetchMessages();
    }, [currentUserId]);

    return (
        <MessagesList currentUserId={currentUserId} messages={messages} />
    );
}
