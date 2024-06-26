import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/firebase-client";
import { MessageSchema } from "../../util/types";

async function handler(req: NextRequest) {
  const conversationId = req.nextUrl.searchParams.get("conversationId");
  const currentUserId = req.nextUrl.searchParams.get("currentUserId");

  if (!conversationId || !currentUserId) {
    return new NextResponse(
      JSON.stringify({
        error:
          "Missing required query parameters: conversationId and/or currentUserId",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  try {
    const messagesQuery = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
      orderBy("timestamp"),
    );

    const querySnapshot = await getDocs(messagesQuery);
    const messages = querySnapshot.docs.map((doc) => ({
      ...(doc.data() as MessageSchema),
      timestamp: new Date(doc.data().timestamp).toISOString(),
    }));

    return new NextResponse(JSON.stringify({ messages }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching conversation data:", error);
    if (error instanceof Error) {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to fetch conversation data",
          details: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to fetch conversation data",
          details: "An unknown error occurred",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  }
}

export { handler as GET };
