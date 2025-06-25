import { Request, Response } from "express";
import { Chat } from "./chat.model";

const createChat = async (req: Request, res: Response) => {
  try {
    const { participantIds } = req.body;
    let result;
    const isExistParticipantIds = await Chat.findOne({
      participants: { $all: [...participantIds] },
    });
    result = isExistParticipantIds;
    if (!isExistParticipantIds) {
      result = await Chat.create({ participants: participantIds });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(200).json(error);
  }
};

const userChats = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.find({
      participants: { $in: [req.params.userId] },
    }).populate("participants");

    res.status(200).json(chat);
  } catch (error) {
    res.status(200).json(error);
  }
};

const findChat = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.findOne({
      participants: { $all: [req.params.firstId, req.params.secondId] },
    });

    res.status(200).json(chat);
  } catch (error) {
    res.status(200).json(error);
  }
};

export const ChatController = {
  createChat,
  userChats,
  findChat,
};
