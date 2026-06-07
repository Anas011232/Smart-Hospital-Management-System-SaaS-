// src/sockets/queue.socket.js
let io;

export const initSocket = (server) => {
  import("socket.io").then(({ Server }) => {
    io = new Server(server, {
      cors: {
        origin: "*", // আপনার ফ্রন্টএন্ড URL দিন
        methods: ["GET", "POST", "PATCH", "PUT"],
      },
    });

    io.on("connection", (socket) => {
      console.log("⚡ A user connected to socket:", socket.id);

      // ডাক্তার বা পেশেন্ট নির্দিষ্ট রুম জয়েন করবে (যেমন: room_doctorID)
      socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`👤 User joined room: ${roomId}`);
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected");
      });
    });
  });
};

export const emitQueueUpdate = (roomId, data) => {
  if (io) {
    io.to(roomId).emit("queue-update", data);
  }
};