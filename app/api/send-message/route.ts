import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/firebase-client";
import { generateId } from "../../util/helper-functions";

async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  try {
    const data = await req.json();
    const { senderId, receiverId, content } = data;

    const senderDoc = await getDoc(doc(db, "users", senderId));
    const receiverDoc = await getDoc(doc(db, "users", receiverId));
    if (!senderDoc.exists() || !receiverDoc.exists()) {
      return new NextResponse("Sender or receiver not found", { status: 404 });
    }
    const senderName = senderDoc.data().userName;
    const receiverName = receiverDoc.data().userName;

    // Handle conversation ID creation or retrieval
    const conversationQuery = query(
      collection(db, "conversations"),
      where("participants", "==", [senderId, receiverId].sort()),
    );
    const querySnapshot = await getDocs(conversationQuery);

    let conversationId;
    if (querySnapshot.empty) {
      conversationId = await generateId("conversation");
      await setDoc(doc(db, "conversations", conversationId), {
        participants: [senderId, receiverId].sort(),
      });
    } else {
      conversationId = querySnapshot.docs[0].id;
    }

    // Create a new message
    const messageId = await generateId("message");
    const newMessage = {
      id: messageId,
      conversationId,
      content,
      timestamp: new Date().toISOString(),
      sender: {
        id: senderId,
        name: senderName,
      },
      receiver: {
        id: receiverId,
        name: receiverName,
      },
    };
    await addDoc(collection(db, "messages"), newMessage);

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Failed to send message:", error);
    return new NextResponse("Failed to send message", { status: 500 });
  }
}

export { handler as POST };
