import admin, { ServiceAccount } from "firebase-admin";
import functions from "firebase-functions";
import fs from "fs";
import fetch from "node-fetch"
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from 'url';

const serviceAccountJson = await import("./serviceAccount.json", {
  assert: { type: "json" }
});

const serviceAccount = serviceAccountJson.default as ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const db = admin.firestore();
const openai = new OpenAI({
  apiKey: functions.config().openai.key,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../src/context.txt");
const context = fs.readFileSync(filePath, "utf8");

export const processMessages = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
    console.log("Checking messages since:", oneDayAgo);

    // Retrieve all messages from the last 24 hours
    const messagesRef = db
      .collection("messages")
      .where("timestamp", ">=", oneDayAgo);
    const messages = await messagesRef.get();

    if (messages.empty) {
      console.log("No new messages");
      return null;
    }

    console.log(`Processing ${messages.size} messages...`);

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
      if (!convoData.participants.includes("u1")) {
        continue;
      }

      const lastResponseTimestamp = convoData.lastResponseTimeByUser["u1"];

      for (const [senderId, texts] of Object.entries(senders)) {
        const messages = texts.map((text) => ({
          text,
          timestamp: new Date().toISOString(),
        }));
        // Filter out messages that were sent before the last response from currentUser
        const filteredMessages = messages.filter(
          (msg) => new Date(msg.timestamp) > new Date(lastResponseTimestamp),
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

        try {
          const sendMessageResponse = await fetch("https://little-help.vercel.app/api/send-message", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              senderId: "u1",
              receiverId: senderId,
              content: response.choices[0].message.content,
            }),
          });

          if (sendMessageResponse.ok) {
            console.log("Message sent successfully:", response.choices[0].message.content);
          } else {
            console.error("Failed to send message:", await sendMessageResponse.text());
          }
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    }

    return null;
  });
