import db from '../lib/firebase-client';
import { collection, doc, runTransaction } from 'firebase/firestore';

export async function generateId(type: string): Promise<string> {
    const counterRef = doc(collection(db, 'counters'), `${type}Counter`);
    const idPrefix = type[0];

    return runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        let newCount;

        if (!counterDoc.exists()) {
            newCount = 1;
            transaction.set(counterRef, { count: newCount });
        } else {
            newCount = counterDoc.data().count + 1;
            transaction.update(counterRef, { count: newCount });
        }

        return `${idPrefix}${newCount}`;
    });
}
