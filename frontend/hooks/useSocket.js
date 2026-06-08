"use client";

import { useEffect, useState, useRef } from "react";
import { initSocket, joinQueueRoom, leaveQueueRoom } from "@/lib/socket";

export const useSocket = (roomId = null) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const joinedRoomsRef = useRef(new Set());

  // -------------------------
  // INIT SOCKET ONLY ONCE
  // -------------------------
  useEffect(() => {
    const socket = initSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      setIsConnected(true);
      console.log("✅ Socket connected");
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log("❌ Socket disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    setIsConnected(socket.connected);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  // -------------------------
  // ROOM MANAGEMENT (FIXED FOR MULTIPLE ROOMS)
  // -------------------------
  useEffect(() => {
    if (!socketRef.current || !roomId) return;

    // Prevent duplicate joins
    if (joinedRoomsRef.current.has(roomId)) return;

    joinedRoomsRef.current.add(roomId);
    joinQueueRoom(roomId);
    console.log("✅ Joined room:", roomId);

    return () => {
      if (socketRef.current && joinedRoomsRef.current.has(roomId)) {
        leaveQueueRoom(roomId);
        joinedRoomsRef.current.delete(roomId);
        console.log("❌ Left room:", roomId);
      }
    };
  }, [roomId]);

  // -------------------------
  // SAFE API WRAPPERS
  // -------------------------
  const on = (eventName, callback) => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on(eventName, callback);
  };

  const off = (eventName, callback) => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.off(eventName, callback);
  };

  const emit = (eventName, data) => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit(eventName, data);
  };

  return {
    socket: socketRef.current,
    isConnected,
    on,
    off,
    emit,
  };
};

export default useSocket;