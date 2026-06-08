import { io } from "socket.io-client";

let socket = null;

/**
 * Initialize socket connection (called once)
 */
export const initSocket = () => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io("http://localhost:5000", {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  return socket;
};

/**
 * Join a queue room (date-based room: room_${doctorId}_${date})
 */
export const joinQueueRoom = (roomId) => {
  if (!socket) {
    console.warn("Socket not initialized");
    return;
  }
  socket.emit("join-room", roomId);
};

/**
 * Leave a queue room
 */
export const leaveQueueRoom = (roomId) => {
  if (!socket) {
    console.warn("Socket not initialized");
    return;
  }
  socket.emit("leave-room", roomId);
};

export default socket;
