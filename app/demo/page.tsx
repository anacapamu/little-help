"use client";

import React, { FormEvent, useState } from "react";

const CreateUserForm: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: FormEvent) => {
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
          errorData.message || "Failed to create user. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        `Error creating user. Please check the console for more information.`,
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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userName">Name:</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="profilePic">Profile Picture:</label>
          <input
            type="file"
            id="profilePic"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Create User</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default CreateUserForm;
