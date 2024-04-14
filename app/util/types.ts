export interface MessageType {
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
