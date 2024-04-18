import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/firebase-client';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ConversationSchema  } from '../../util/types';

async function handler(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
    }

    const currentUserId = req.nextUrl.searchParams.get('userId');
    if (!currentUserId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const conversationsRef = collection(db, 'conversations');
        const q = query(conversationsRef, where('participants', 'array-contains', currentUserId));
        const querySnapshot = await getDocs(q);

        const conversations: ConversationSchema[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            conversations.push({
                conversationId: doc.id,
                participants: data.participants
            });
        });

        return NextResponse.json(conversations);
    } catch (error) {
        console.error('Error listing conversations:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Failed to list conversations', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'Failed to list conversations', details: "An unknown error occurred" }, { status: 500 });
        }
    }
}

export { handler as GET };
