import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import DocumentDetail from "./pages/documents/[documentId]/DocumentDetail";
import Dashboard from "./pages/Dashboard/Dashboard";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/documents/:sectionId" element={<DocumentDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
