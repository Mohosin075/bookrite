import express from "express";
import { MessageController } from "./message.controller";

const router = express.Router();

router.get("/:chatId", MessageController.getMessages);
router.route("/").post(MessageController.createMessage);

export const MessageRoutes = router;
