"use client";

import React, { FormEvent, useState } from "react";

interface CreateUserFormProps {}

const CreateUserForm: React.FC<CreateUserFormProps> = () => {
  const [userName, setUserName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !userName) {
      setMessage("Please enter a name and select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("profilePic", file);

    try {
      const response = await fetch("/api/create-user", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`User created successfully! User ID: ${data.userId}`);
      } else {
        const errorData = await response.json();
        setMessage(
          errorData.message || "Failed to create user. Please try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        `Error creating user. Please check the console for more information.`
      );
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-violet-500 via-blue-500 to-red-500">
      <h2>Create a user to chat with Emma, the Barre instructor!</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 p-5 bg-white rounded shadow-lg">
        <div className="flex items-center gap-2">
          <label htmlFor="userName" className="block text-sm font-bold text-gray-700">Name:</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="flex-1 px-3 py-2 border rounded shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="profilePic" className="block text-sm font-bold text-gray-700">Profile Picture:</label>
          <input
            type="file"
            id="profilePic"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            required
            className="flex-1 px-3 py-2 border rounded shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">Create User</button>
      </form>
      <p className="mt-5 text-lg text-white">{message}</p>
    </div>
  );
};

export default CreateUserForm;
