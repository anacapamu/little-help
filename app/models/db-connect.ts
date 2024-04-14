import mongoose from 'mongoose';

interface Connection {
  isConnected?: number;
}

const connection: Connection = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    return;
  }

  const db = await mongoose.connect(process.env.MONGO_URI!);

  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
