import React from 'react';
import MessageItem from './message-item';

interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
}

interface Props {
    messages: Message[];
}

const MessageList: React.FC<Props> = ({ messages }) => {
    return (
        <div>
            {messages.map(message => (
                <MessageItem key={message.id} message={message} />
            ))}
        </div>
    );
}

export default MessageList;
