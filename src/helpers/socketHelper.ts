// import colors from 'colors';
// import { Server } from 'socket.io';
// import { logger } from '../shared/logger';

// const socket = (io: Server) => {
//   io.on('connection', socket => {
//     logger.info(colors.blue('A user connected'));

//     //disconnect
//     socket.on('disconnect', () => {
//       logger.info(colors.red('A user disconnect'));
//     });
//   });
// };

// export const socketHelper = { socket };

import colors from 'colors';
import { Server } from 'socket.io';
import { Chat } from '../app/modules/chat/chat.model';

const socket = (io: Server) => {
  io.on('connection', socket => {
    console.log(colors.blue(`User connected: ${socket.id}`));

    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(colors.yellow(`User ${socket.id} joined room: ${roomId}`));
    });

    socket.on('send_message', async data => {
      try {
        const { roomId, sender, message } = data;
        if (!roomId || !sender || !message) {
          console.log({data})
          return;
        }

        const savedMessage = await Chat.create({ roomId, sender, message });

        io.to(roomId).emit('receive_message', savedMessage);
      } catch (error) {
        console.error(colors.red('Error in send_message handler:'), error);
        // Optionally, send error message back to sender
        socket.emit('error_message', { message: 'Failed to send message' });
      }
    });

    // Handle disconnect event
    socket.on('disconnect', reason => {
      console.log(
        colors.red(`User disconnected: ${socket.id}, reason: ${reason}`)
      );
    });

    // Optional: catch socket errors
    socket.on('error', error => {
      console.error(colors.red(`Socket error from user ${socket.id}:`), error);
    });
  });
};

export const socketHelper = { socket };
