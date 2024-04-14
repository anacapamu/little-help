import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../models/db-connect';
import Message, { IMessage } from '../models/message';

function isError(e: any): e is Error {
    return e && e.message && typeof e.message === 'string';
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const messages: Array<IMessage> = await Message.find({}).sort({ timestamp: -1 }).limit(10);
        res.status(200).json({ success: true, data: messages });
      } catch (error) {
        if (isError(error)) {
          res.status(400).json({ success: false, error: error.message });
        } else {
          res.status(400).json({ success: false, error: "An unknown error occurred" });
        }
      }
      break;

    case 'POST':
      try {
        const message: IMessage = await Message.create(req.body);
        res.status(201).json({ success: true, data: message });
      } catch (error) {
        if (isError(error)) {
          res.status(400).json({ success: false, error: error.message });
        } else {
          res.status(400).json({ success: false, error: "An unknown error occurred" });
        }
      }
      break;

    default:
      res.status(405).json({ success: false });
      break;
  }
}
