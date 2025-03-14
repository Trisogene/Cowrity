import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import DocumentDetail from "./pages/documents/[documentId]/DocumentDetail";
import Dashboard from "./pages/Dashboard/Dashboard";
import { DocumentDetailProvider } from "./pages/documents/[documentId]/DocumentDetail.context";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/documents/:sectionId"
          element={
            <DocumentDetailProvider>
              <DocumentDetail />
            </DocumentDetailProvider>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
