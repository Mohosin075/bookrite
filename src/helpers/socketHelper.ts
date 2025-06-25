import { Server } from 'socket.io';
import { Message } from '../app/modules/message/message.model';

const socket = (io: Server) => {
  io.on('connection', socket => {
    console.log('A user connected');
    // Handle joining a chat room
    socket.on('joinChat', chatId => {
      console.log('chatId', chatId);
      socket.join(chatId);
    });

    // Handle sending a message
    socket.on('sendMessage', messageData => {
      const { chatId, senderId, text } = messageData;

      //Create a new message in the database
      const newMessage = new Message({ chatId, senderId, text });
      newMessage.save();

      // Broadcast the message to the chat room
      io.to(chatId).emit('receiveMessage', newMessage);
    });

    //disconnect socket
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

export const SocketHelper = { socket };
