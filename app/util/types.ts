export interface MessageSchema {
  id: string;
  conversationId: string;
  content: string;
  timestamp: string;
  sender: {
    id: string;
    name: string;
  };
  receiver: {
    id: string;
    name: string;
  };
}

export interface ConversationSchema {
  conversationId: string;
  participants: string[];
};
