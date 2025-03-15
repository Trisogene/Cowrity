import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { initSockets } from "./services/socketService";
import documentRoutes from "./routes/documentRoutes";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/api/documents", documentRoutes);

initSockets(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
