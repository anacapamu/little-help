import React from 'react';

import MessagesList from "./components/messages-list";
import mockMessages from './mock-data/mock-messages.json'

export default function Home() {
  return (
    <MessagesList currentUserId="u5" messages={mockMessages} />
  );
}
