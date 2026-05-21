const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/database");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://dev-tinder-inky.vercel.app",
  "https://dev-tinder-one-delta.vercel.app",
];

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true, exposedHeaders: ["X-Auth-Token"] }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const { chatRouter, areConnected } = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

// ─── Socket.io ───────────────────────────────────────────────────────────────

const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGINS, credentials: true },
});

const User = require("./models/user");
const Message = require("./models/message");

const parseCookies = (cookieStr = "") =>
  Object.fromEntries(
    cookieStr.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    }),
  );

io.use(async (socket, next) => {
  try {
    const authToken = socket.handshake.auth?.token;
    const cookieToken = parseCookies(socket.handshake.headers.cookie).token;
    const token = (authToken && authToken !== "null" && authToken !== "undefined") ? authToken : cookieToken;
    if (!token) throw new Error("No auth token");

    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(_id);
    if (!user) throw new Error("User not found");

    socket.user = user;
    next();
  } catch (err) {
    console.error("[Socket] Auth failed:", err.message);
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user._id.toString();
  socket.join(userId);

  socket.on("send_message", async ({ receiverId, content }) => {
    try {
      if (!content?.trim() || !receiverId) return;
      if (!(await areConnected(userId, receiverId))) return;

      const message = await Message.create({
        senderId: userId,
        receiverId,
        content: content.trim(),
      });

      const payload = {
        _id: message._id,
        senderId: userId,
        receiverId,
        content: message.content,
        createdAt: message.createdAt,
      };

      io.to(userId).emit("receive_message", payload);
      io.to(receiverId).emit("receive_message", payload);
    } catch (err) {
      socket.emit("message_error", err.message);
    }
  });
});

// ─── Start ───────────────────────────────────────────────────────────────────

connectDB()
  .then(() => {
    console.log("Database Connection Successfull....!");
    server.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.log("Database Connection UnSuccessfull....!" + err.message);
  });
