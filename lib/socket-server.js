import { io } from "socket.io-client";
let ioInstance = null;

export function setIO(io) {
  ioInstance = io;
}

export function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.io instance not initialized");
  }
  return ioInstance;
}


const socket = io({
  path: "/api/socket",
  autoConnect: false,
});

export default socket;
