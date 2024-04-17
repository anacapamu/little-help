import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";
import { db, storage } from "../../lib/firebase-client";
import { generateId } from "../../util/helper-functions";

async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { error: `Method ${req.method} Not Allowed` },
      {
        status: 405,
      },
    );
  }

  const data = await req.formData();
  const file = data.get("profilePic");
  const userName = data.get("userName");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Invalid file upload" }, { status: 400 });
  }

  if (!userName || typeof userName !== "string") {
    return NextResponse.json({ error: "Invalid Name" }, { status: 400 });
  }

  const validImageTypes = ["image/jpeg", "image/png"];
  if (!validImageTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 },
    );
  }

  try {
    const userId = await generateId("user");
    const userRef = doc(collection(db, "users"), userId);

    const storageRef = ref(storage, `profile_pics/${userId}`);
    await uploadBytes(storageRef, file);
    const profilePicUrl = await getDownloadURL(storageRef);

    await setDoc(
      userRef,
      {
        userName,
        userId,
        profilePicUrl,
      },
      { merge: true },
    );

    return NextResponse.json({ userId, userName, profilePicUrl });
  } catch (e) {
    console.error("Error adding user: ", e);
    return NextResponse.json(
      { error: "Failed to add user", details: e.message },
      { status: 500 },
    );
  }
}

export { handler as POST };
