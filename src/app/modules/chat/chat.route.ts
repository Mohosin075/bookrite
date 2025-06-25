import express from "express";
import { ChatController } from "./chat.controller";
const router = express.Router();

router.post("/", ChatController.createChat);
router.get("/:userId", ChatController.userChats);
router.get("/find/:firstId/:secondId", ChatController.findChat);

export const ChatRoutes = router;
