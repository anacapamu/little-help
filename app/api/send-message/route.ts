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
import db from "../../lib/firebase-client";
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
    const senderName = senderDoc.data().username;
    const receiverName = receiverDoc.data().username;

    // Check if a conversationId exists
    const conversationQuery = query(
      collection(db, "conversations"),
      where("participants", "==", [senderId, receiverId].sort()),
    );
    const querySnapshot = await getDocs(conversationQuery);

    let conversationId;
    if (querySnapshot.empty) {
      // No conversationId exists, create a new one
      conversationId = await generateId("conversation");
      await setDoc(doc(db, "conversations", conversationId), {
        participants: [senderId, receiverId].sort(),
      });
    } else {
      // Use existing conversationID
      const conversationData = querySnapshot.docs[0];
      conversationId = conversationData.id;
    }

    // Create a new message
    const messageId = await generateId("message");
    await addDoc(collection(db, "messages"), {
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
    });

    return NextResponse.json({
      success: true,
      messageId,
      conversationId,
      content,
      senderName,
      receiverName,
    });
  } catch (error) {
    console.error("Failed to send message:", error);
    return new NextResponse("Failed to send message", { status: 500 });
  }
}

export { handler as POST };
