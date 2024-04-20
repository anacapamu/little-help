"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMessages = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const fs = require("fs");
const node_fetch_1 = require("node-fetch");
const openai_1 = require("openai");
const path = require("path");
var serviceAccount = require("../serviceAccount.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const openai = new openai_1.default({
    apiKey: functions.config().openai.key,
});
const filePath = path.join(__dirname, "./context.txt");
const context = fs.readFileSync(filePath, "utf8");
exports.processMessages = functions.pubsub
    .schedule("every 5 minutes")
    .onRun((context) => __awaiter(void 0, void 0, void 0, function* () {
    const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
    console.log("Checking messages since:", oneDayAgo);
    // Retrieve all messages from the last 24 hours
    const messagesRef = db
        .collection("messages")
        .where("timestamp", ">=", oneDayAgo);
    const messages = yield messagesRef.get();
    if (messages.empty) {
        console.log("No new messages");
        return null;
    }
    console.log(`Processing ${messages.size} messages...`);
    const conversations = {};
    messages.forEach((doc) => {
        const msg = doc.data();
        const convoKey = msg.conversationId;
        const senderKey = msg.sender.id;
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
        const convoDoc = yield convoRef.get();
        if (!convoDoc.exists || !convoDoc.data()) {
            console.log(`No conversation found for ID: ${convoId}`);
            continue;
        }
        const convoData = convoDoc.data();
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
            const filteredMessages = messages.filter((msg) => new Date(msg.timestamp) > new Date(lastResponseTimestamp));
            if (filteredMessages.length === 0) {
                continue;
            }
            const fullMessage = filteredMessages.map((msg) => msg.text).join(" ");
            const response = yield openai.chat.completions.create({
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
            console.log(`AI Response: ${response.choices[0].message}`);
            yield (0, node_fetch_1.default)("http://localhost:3000/api/send-message", {
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
}));
//# sourceMappingURL=index.js.map