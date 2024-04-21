"use client";

import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase-client";

type User = {
  id: string;
  userName: string;
};

const SendMessageComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList: User[] = [];
      querySnapshot.forEach((doc) => {
        userList.push({ id: doc.id, userName: doc.data().userName });
      });
      setUsers(userList);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const sendMessage = async () => {
    if (!selectedUserId || !message) return;
    setLoading(true);
    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: selectedUserId,
          receiverId: "u1", // fixed receiver ID
          content: message,
        }),
      });
      const responseData = await response.json();
      if (response.ok) {
        alert(`Message sent successfully: ${responseData.content}`);
      } else {
        throw new Error(responseData.message);
      }
    } catch (error: any) {
      alert(`Failed to send message: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-violet-500 via-blue-500 to-red-500 p-4">
      <h2 className="text-white text-lg mb-4">Send a Message to Emma Fu, the Barre Instructor as</h2>
      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        disabled={loading}
        className="mb-4 px-3 py-2 border rounded shadow appearance-none bg-white leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="">Select a User</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.userName}
          </option>
        ))}
      </select>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
        disabled={loading}
        className="mb-4 p-3 h-32 border rounded shadow appearance-none bg-white leading-tight focus:outline-none focus:shadow-outline"
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 disabled:bg-gray-500"
      >
        Send Message
      </button>
    </div>
  );
};

export default SendMessageComponent;
