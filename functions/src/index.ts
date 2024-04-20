import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as fs from "fs";
import fetch from "node-fetch";
import OpenAI from "openai";
import * as path from "path";

var serviceAccount = require("../serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const openai = new OpenAI({
  apiKey: functions.config().openai.key,
});

const filePath = path.join(__dirname, "./context.txt");
const context = fs.readFileSync(filePath, "utf8");

export const processMessages = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async (context) => {
    const oneDayAgo = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 86400000)
  );

    // Retrieve all messages from the last 2 minutes
    const messagesRef = db
      .collection("messages")
      .where("createdAt", ">=", oneDayAgo);
    const messages = await messagesRef.get();

    if (messages.empty) {
      console.log("No new messages");
      return null;
    }

    const conversations: Record<string, Record<string, string[]>> = {};
    messages.forEach((doc) => {
      const msg = doc.data();
      const convoKey = msg.conversationId as string;
      const senderKey = msg.sender.id as string;
      if (!conversations[convoKey]) {
        conversations[convoKey] = {};
      }
      if (!conversations[convoKey][senderKey]) {
        conversations[convoKey][senderKey] = [];
      }
      conversations[convoKey][senderKey].push(msg.content);
    });

    for (const [convoId, senders] of Object.entries(conversations)) {
      const convoRef = db.collection("conversations").doc(convoId);
      const convoDoc = await convoRef.get();

      if (!convoDoc.exists || !convoDoc.data()) {
        console.log(`No conversation found for ID: ${convoId}`);
        continue;
      }

      const convoData = convoDoc.data()!;
      if (!convoData.participants.includes("currentUser")) {
        continue;
      }

      const lastResponseTimestamp =
        convoData.lastResponseTimeByUser["currentUser"];

      for (const [senderId, texts] of Object.entries(senders)) {
        const messages = texts.map((text) => ({ text, createdAt: new Date() }));
        // Filter out messages that were sent before the last response from currentUser
        const filteredMessages = messages.filter(
          (msg) => msg.createdAt > new Date(lastResponseTimestamp),
        );
        if (filteredMessages.length === 0) {
          continue;
        }
        const fullMessage = filteredMessages.map((msg) => msg.text).join(" ");

        const response = await openai.chat.completions.create({
          model: "gpt-4-turbo",
          messages: [
            {
              role: "system",
              content: `${context}`,
            },
            {
              role: "user",
              content: `${fullMessage}`,
            },
          ],
          max_tokens: 150,
          temperature: 1,
          top_p: 1,
          presence_penalty: 0,
          frequency_penalty: 0,
          n: 1,
          stream: false,
        });

        await fetch("/api/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: "currentUser",
            receiverId: senderId,
            content: response.choices[0].message,
          }),
        });
      }
    }

    return null;
  });
