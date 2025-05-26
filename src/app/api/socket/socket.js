// pages/api/socket.js
import { Server } from "socket.io";

export default function handler(req, res) {
    console.log(req)
  if (!res.socket.server.io) {
    console.log("🧠 Setting up Socket.IO server...");

    const io = new Server(res.socket.server, {
      path: "/api/socketio", 
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("✅ Socket connected:", socket.id);

      socket.on("join", ({ userId }) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
      });

      socket.on("private_message", ({ content, to }) => {
        io.to(to).emit("private_message", {
          content,
          from: socket.id,
        });
      });
    });
  } else {
    console.log("Socket.IO already initialized");
  }

  res.end();
}
