const io = require("socket.io")(4000, {
  cors: {
    origin: "http://localhost:3000", // Next.js
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Client connected", socket.id);
});
