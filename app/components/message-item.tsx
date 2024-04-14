import React from 'react';
import Link from 'next/link';
import { MessageType } from '../util/types';
import Heart from './heart';

interface Props {
    message: MessageType;
    preview?: boolean;
}

const MessageItem: React.FC<Props> = ({ message, preview = false }) => {
    const content = preview
        ? (message.content.length > 100 ? `${message.content.substring(0, 100)}...` : message.content)
        : message.content;

    const hasThanks = /thanks|thank you/i.test(message.content); // TODO: add other things to like

    return (
        <Link href={`/conversation/${message.conversationId}`}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h4>{message.sender.name}</h4>
                <p>{content} {hasThanks && <Heart color="red" />}</p>
                <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
            </div>
        </Link>
    );
}

export default MessageItem;
