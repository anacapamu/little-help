import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMessage extends Document {
  content: string;
  sender: string;
  receiver: string;
  timestamp: Date;
}

const messageSchema: Schema = new Schema({
  content: { type: String, required: true },
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

export default Message;
