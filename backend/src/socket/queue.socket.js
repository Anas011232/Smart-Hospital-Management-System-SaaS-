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
    });
  });

  return io;
};

export const emitQueueUpdate = (roomId, data) => {
  if (io) {
    io.to(roomId).emit("queue-update", data);
  } else {
    console.warn("Socket.io is not initialized yet!");
  }
};