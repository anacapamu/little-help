import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/firebase-client';
import { doc, getDoc } from 'firebase/firestore';

async function handler(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
    }

    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const userRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userData = docSnap.data();
        return NextResponse.json({ userId, userName: userData.userName, profilePicUrl: userData.profilePicUrl });
    } catch (error) {
        console.error('Error fetching user details:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Failed to fetch user details', details: error.message }, { status: 500 });
          } else {
          return NextResponse.json(
            { error: "Failed to fetch user details'", details: "An unknown error occurred" },
            { status: 500 },
          );
        }
    }
}

export { handler as GET };
