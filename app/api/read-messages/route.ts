import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import db from "../../lib/firebase-client";
import { MessageType } from "../../util/types";

async function handler(req: NextRequest) {
  const conversationId = req.nextUrl.searchParams.get("conversationId");
  const currentUserId = req.nextUrl.searchParams.get("currentUserId");

  try {
    let messagesQuery;
    if (conversationId) {
      messagesQuery = query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId),
        orderBy("timestamp"),
      );
    } else if (currentUserId) {
      const senderQuery = query(
        collection(db, "messages"),
        where("sender.id", "==", currentUserId),
        orderBy("timestamp", "desc"),
      );

      const receiverQuery = query(
        collection(db, "messages"),
        where("receiver.id", "==", currentUserId),
        orderBy("timestamp", "desc"),
      );

      const [senderMessages, receiverMessages] = await Promise.all([
        getDocs(senderQuery),
        getDocs(receiverQuery),
      ]);

      // Combine and deduplicate messages
      const messageSet = new Set();
      const combinedMessages = [
        ...senderMessages.docs,
        ...receiverMessages.docs,
      ]
        .map((doc) => ({ ...(doc.data() as MessageType) }))
        .filter((msg) => {
          const duplicate = messageSet.has(msg.id);
          messageSet.add(msg.id);
          return !duplicate;
        })
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

      return new NextResponse(JSON.stringify(combinedMessages), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Missing required query parameters" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const querySnapshot = await getDocs(messagesQuery);
    const messages = querySnapshot.docs.map((doc) => ({
      ...(doc.data() as MessageType),
    }));

    return new NextResponse(JSON.stringify(messages), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch messages" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

export { handler as GET };
