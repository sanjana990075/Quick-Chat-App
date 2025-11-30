import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./lib/db.js";
import messageRouter from "./routes/messageRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
export const io = new Server(server, {
  cors: { origin: "*" }
});

// store online users
export const userSocketmap = {};

// socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketmap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketmap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketmap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketmap));
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);       // contains its own protectRoute
app.use("/api/messages", messageRouter); // contains its own protectRoute

// Connect to database
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log("Server is running on port: " + PORT)
);
