"use client";

import { useEffect, useState } from 'react';

interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
}

const useMessages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const response = await fetch('/api/messages');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMessages(data.data);
            } catch (error) {
                setIsError(true);
                console.error('Failed to fetch messages:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, []);

    return { messages, isLoading, isError };
}

export default useMessages;
