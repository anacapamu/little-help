import React from 'react';
import Link from 'next/link';
import { MessageType } from '../util/types';
import Conversation from '../conversation/[conversationId]/page';

interface Props {
    message: MessageType;
    preview?: boolean;
}

const MessageItem: React.FC<Props> = ({ message, preview = false }) => {
    const content = preview
        ? (message.content.length > 100 ? `${message.content.substring(0, 100)}...` : message.content)
        : message.content;

    return (
        <Link href={`/conversation/${message.conversationId}`}>
            <div>
                <h4>{message.sender.name}</h4>
                <p>{content}</p>
                <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
            </div>
        </Link>
    );
}

export default MessageItem;
