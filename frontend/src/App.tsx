import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Room from "./pages/Room";

const Home: React.FC = () => {
  const [roomId, setRoomId] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      window.location.href = `/${roomId}`;
    }
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Collaborative Editor</h1>
        <p>
          Enter a room ID to join or create a collaborative editing session.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
          <button type="submit">Join Room</button>
        </form>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:sectionId" element={<Room />} />
      </Routes>
    </Router>
  );
};

export default App;
