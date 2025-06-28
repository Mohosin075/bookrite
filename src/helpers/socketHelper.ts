// import { Server } from 'socket.io';
// import { Message } from '../app/modules/message/message.model';
// import { OnlineUserTracker } from '../util/onlineUsers';

// const socket = (io: Server) => {
//   io.on('connection', socket => {
//     console.log('A user connected');
//     // Handle joining a chat room
//     socket.on('joinChat', chatId => {
//       console.log('chatId', chatId);
//       socket.join(chatId);
//     });

//     // Handle sending a message
//     socket.on('sendMessage', messageData => {
//       const { chatId, senderId, text, recipientId  } = messageData;

//       //Create a new message in the database
//       const newMessage = new Message({ chatId, senderId, text });
//       newMessage.save();

//       // Broadcast the message to the chat room
//       io.to(chatId).emit('receiveMessage', newMessage);
//     });

//     //disconnect socket
//     socket.on('disconnect', () => {
//       console.log('A user disconnected');
//     });
//   });
// };

// export const SocketHelper = { socket };

import { Server } from 'socket.io';
import { Message } from '../app/modules/message/message.model';
import { OnlineUserTracker } from '../util/onlineUsers';

const socket = (io: Server) => {
  io.on('connection', socket => {
    console.log('A user connected');

    // ✅ 🔐 New logic (non-intrusive): Register user to track socketId
    socket.on('register', (userId: string) => {
      OnlineUserTracker.set(userId, socket.id);
      console.log(`Registered user: ${userId}`);
    });

    // ✅ 🔒 Your original code — left untouched
    socket.on('joinChat', chatId => {
      console.log('chatId', chatId);
      socket.join(chatId);
    });

    socket.on('sendMessage', messageData => {
      const { chatId, senderId, text, recipientId } = messageData;

      const newMessage = new Message({ chatId, senderId, text });
      newMessage.save();

      io.to(chatId).emit('receiveMessage', newMessage);

      // ✅ 🔐 New logic: Emit notification separately (non-intrusive)
      const recipientSocketId = OnlineUserTracker.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientId).emit('notification', {
          type: 'new_message',
          message: 'You have a new message',
          metadata: {
            chatId,
            messageId: 'sdfksdlf',
          },
        });
      }
    });

    // ✅ 🔐 New logic: Clean up on disconnect
    socket.on('disconnect', () => {
      console.log('A user disconnected');
      OnlineUserTracker.remove(socket.id); // 👈 Just extra cleanup
    });
  });
};

export const SocketHelper = { socket };
