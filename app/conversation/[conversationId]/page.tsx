'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MessageItem from '../../components/message-item';
import { MessageType } from '../../util/types';
import mockMessages from '../../mock-data/mock-messages.json'

const Conversation: React.FC = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [senderName, setSenderName] = useState<string>('');
    const { conversationId } = useParams();

    useEffect(() => {
        if (typeof conversationId === 'string') {
            fetchMessages(conversationId);
        }
    }, [conversationId]);

    // const fetchMessages = async (id: string) => {
    //     try {
    //         const response = await fetch(`/api/messages?conversationId=${id}`);
    //         if (!response.ok) throw new Error('Network response was not ok');
    //         const data: MessageType[] = await response.json();
    //         setMessages(data);
    //         if (data.length > 0) {
    //             setSenderName(data[0].sender.name);
    //         }
    //     } catch (error) {
    //         console.error('Fetch error:', error);
    //     }
    // };

    const fetchMessages = (id: string) => {
        const filteredMessages = mockMessages.filter(m => m.conversationId === id);

        setMessages(filteredMessages);
        if (filteredMessages.length > 0) {
            setSenderName(filteredMessages[0].sender.name);
        } else {
            setSenderName('No messages found');
        }
    };

    return (
        <div>
            <h2>Conversation with {senderName || 'Loading...'}</h2>
            {messages.map(message => (
                <MessageItem key={message.id} message={message} preview={false} />
            ))}
        </div>
    );
};

export default Conversation;
