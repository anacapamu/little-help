import { useRouter } from 'next/router';
import React from 'react';

const Conversation: React.FC = () => {
    const router = useRouter();
    const { conversation } = router.query;

    return (
        <div>
            <h2>Conversation with {conversation}</h2>
            {/* Add components to show detailed conversation */}
        </div>
    );
}

export default Conversation;
