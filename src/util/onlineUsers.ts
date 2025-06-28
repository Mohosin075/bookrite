const onlineUsers = new Map<string, string>();

export const OnlineUserTracker = {
  set: (userId: string, socketId: string) => onlineUsers.set(userId, socketId),
  get: (userId: string) => onlineUsers.get(userId),
  remove: (socketId: string) => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socketId) {
        onlineUsers.delete(userId);
        break;
      }
    }
  },
  all: () => onlineUsers,
};
