import dotenv from "dotenv";
import http from "http";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./sockets/socket.server.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO engine
initSocket(server);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server & Socket.IO running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Server startup failed:", err);
  });
