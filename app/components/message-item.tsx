import React from 'react';
import Link from 'next/link';

interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
}

interface Props {
    message: Message;
}

const MessageItem: React.FC<Props> = ({ message }) => {
    return (
        <Link href={`/conversation/${message.id}`}>
            <a>
                <div>
                    <h4>{message.sender}</h4>
                    <p>{message.content.substring(0, 100)}...</p>
                    <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
                </div>
            </a>
        </Link>
    );
}

export default MessageItem;
