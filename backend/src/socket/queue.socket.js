import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST", "PATCH", "PUT"],
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ A user connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      console.log(`Socket ${socket.id} left room: ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("⚡ User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};

export const emitQueueUpdate = (roomId, data) => {
  if (io) {
    io.to(roomId).emit("queue-update", data);
  } else {
    console.warn("Socket.io is not initialized yet!");
  }
};

export const emitQueueStats = (roomId, data) => {
  if (io) {
    io.to(roomId).emit("queue-stats", data);
  }
};

export const emitSessionEnded = (roomId, data) => {
  if (io) {
    io.to(roomId).emit("session-ended", data);
  }
};