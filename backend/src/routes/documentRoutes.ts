import express from "express";
import { documentService } from "../services/documentService";

const documentRoutes = express.Router();

// Get all documents
documentRoutes.get("/", (req, res) => {
  const documents = documentService.getAllDocuments();
  res.json(documents);
});

// Get a document by ID
documentRoutes.get("/:id", (req, res) => {
  const document = documentService.getDocumentById(req.params.id);

  if (!document) {
    return res.status(404).json({ message: "Document not found" });
  }

  res.json(document);
});

// Create a new document
documentRoutes.post("/", (req, res) => {
  try {
    const { title, type, content } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: "Title and type are required" });
    }

    const newDocument = documentService.createDocument({
      title,
      type,
      content,
    });
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ message: "Failed to create document" });
  }
});

// Update a document
documentRoutes.put("/:id", (req, res) => {
  const updatedDocument = documentService.updateDocument(
    req.params.id,
    req.body
  );

  if (!updatedDocument) {
    return res.status(404).json({ message: "Document not found" });
  }

  res.json(updatedDocument);
});

// Delete a document
documentRoutes.delete("/:id", (req, res) => {
  const success = documentService.deleteDocument(req.params.id);

  if (!success) {
    return res.status(404).json({ message: "Document not found" });
  }

  res.status(204).send();
});

export default documentRoutes;
