import { Server, Socket } from "socket.io";

// Store active rooms and their content
const rooms = new Map();

// Store user information
const userSockets = new Map();

export function initSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", ({ roomId, username }) => {
      Array.from(socket.rooms).forEach((room) => {
        if (room !== socket.id) socket.leave(room);
      });

      socket.join(roomId);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          content: "",
          users: [],
        });
      }

      const roomData = rooms.get(roomId);
      const userInfo = { id: socket.id, username };
      roomData.users.push(userInfo);

      userSockets.set(socket.id, { roomId, username });

      socket.emit("document-state", { content: roomData.content });

      io.to(roomId).emit("user-joined", {
        users: roomData.users,
        joinedUser: userInfo,
      });

      console.log(`User ${username} joined room ${roomId}`);
    });

    // In socketService.ts
    socket.on("text-change", ({ content, delta, roomId }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      // Track if we need to update our content
      let contentUpdated = false;

      // Handle delta updates (preferred for real-time collaboration)
      if (delta !== undefined) {
        try {
          // Apply delta to server's version of the document
          room.content = applyDelta(room.content, delta);
          contentUpdated = true;

          // Broadcast delta to other clients for efficiency
          socket.to(roomId).emit("text-change", {
            delta,
            sender: socket.id,
          });

          console.log(
            `Updated room ${roomId} content via delta. Content length: ${room.content.length}`
          );
        } catch (error) {
          console.error("Error applying delta:", error);
        }
      }
      // Handle full content updates (fallback and for occasional syncing)
      else if (content !== undefined) {
        room.content = content;
        contentUpdated = true;

        // Broadcast to other clients
        socket.to(roomId).emit("text-change", {
          content,
          sender: socket.id,
        });

        console.log(
          `Updated room ${roomId} content via full update. Content length: ${content.length}`
        );
      }

      // Periodically (every 10 updates) broadcast full state to all clients to prevent drift
      if (contentUpdated && Math.random() < 0.1) {
        // 10% chance on each update
        setTimeout(() => {
          io.to(roomId).emit("document-state", { content: room.content });
          console.log(
            `Broadcast full document state to room ${roomId} to prevent drift`
          );
        }, 100); // Small delay to let the current update propagate first
      }
    });

    // Handle chat messages
    socket.on("chat-message", ({ roomId, message }) => {
      const userInfo = userSockets.get(socket.id);
      if (userInfo) {
        io.to(roomId).emit("chat-message", {
          text: message,
          sender: userInfo.username,
          timestamp: Date.now(),
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const userInfo = userSockets.get(socket.id);
      if (userInfo) {
        const { roomId, username } = userInfo;
        const roomData = rooms.get(roomId);

        if (roomData) {
          // Remove user from room
          roomData.users = roomData.users.filter(
            (u: any) => u.id !== socket.id
          );

          // Notify others
          io.to(roomId).emit("user-left", {
            userId: socket.id,
            username,
            users: roomData.users,
          });

          // Clean up empty rooms
          if (roomData.users.length === 0) {
            rooms.delete(roomId);
          }
        }

        userSockets.delete(socket.id);
        console.log(`User ${username} disconnected`);
      }
    });
  });
}

// Helper function to apply text changes
function applyDelta(content: string, delta: any): string {
  if (delta.insert !== undefined) {
    const pos = delta.position || content.length;
    return content.substring(0, pos) + delta.insert + content.substring(pos);
  } else if (delta.delete !== undefined) {
    const pos = delta.position || 0;
    const length = delta.delete;
    return content.substring(0, pos) + content.substring(pos + length);
  }
  return content;
}
