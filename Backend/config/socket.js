// socket.js
let io = null;

export const setSocketInstance = (server) => {
  io = server;
};

export const getSocketInstance = () => io;
