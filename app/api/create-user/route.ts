import { collection, doc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import db from "../../lib/firebase-client";
import { generateId } from "../../util/helper-functions";

async function handler(req: NextRequest) {
  if (req.method === "POST") {
    const data = await req.json();
    const { username } = data;

    try {
      const userId = await generateId("user");

      const userRef = doc(collection(db, "users"), userId);
      await setDoc(
        userRef,
        {
          username,
          userId,
        },
        { merge: true },
      ); // Avoids overwriting existing data

      return NextResponse.json({ userId, username });
    } catch (e) {
      console.error("Error adding user: ", e);
      return new NextResponse("Failed to add user", { status: 500 });
    }
  } else {
    return new NextResponse(`Method ${req.method} Not Allowed`, {
      status: 405,
    });
  }
}

export { handler as POST };
