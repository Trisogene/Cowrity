"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentService = exports.DocumentType = void 0;
const uuid_1 = require("uuid");
// You can also add document types as an enum for better type safety
var DocumentType;
(function (DocumentType) {
    DocumentType["DOCUMENT"] = "document";
    DocumentType["SPREADSHEET"] = "spreadsheet";
    DocumentType["PDF"] = "pdf";
    DocumentType["IMAGE"] = "image";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
// Initial set of mock documents
const documents = [
    {
        id: (0, uuid_1.v4)(),
        title: "Q1 Financial Report",
        type: DocumentType.SPREADSHEET,
        createdAt: new Date().toISOString(),
        content: "# Q1 Financial Report\n\nThis is a sample financial report.",
    },
    {
        id: (0, uuid_1.v4)(),
        title: "Product Roadmap 2024",
        type: DocumentType.DOCUMENT,
        createdAt: new Date().toISOString(),
        content: "# Product Roadmap\n\n## Q1 Goals\n- Feature A\n- Feature B",
    },
    {
        id: (0, uuid_1.v4)(),
        title: "Marketing Campaign Assets",
        type: DocumentType.IMAGE,
        createdAt: new Date().toISOString(),
    },
    {
        id: (0, uuid_1.v4)(),
        title: "Legal Contract Template",
        type: DocumentType.PDF,
        createdAt: new Date().toISOString(),
    },
];
exports.documentService = {
    getAllDocuments: () => {
        return documents;
    },
    getDocumentById: (id) => {
        return documents.find((doc) => doc.id === id);
    },
    createDocument: (doc) => {
        const newDocument = {
            ...doc,
            id: (0, uuid_1.v4)(),
            createdAt: new Date().toISOString(),
        };
        documents.push(newDocument);
        return newDocument;
    },
    updateDocument: (id, docData) => {
        const index = documents.findIndex((doc) => doc.id === id);
        if (index === -1)
            return undefined;
        documents[index] = { ...documents[index], ...docData };
        return documents[index];
    },
    deleteDocument: (id) => {
        const initialLength = documents.length;
        const newDocuments = documents.filter((doc) => doc.id !== id);
        if (newDocuments.length === initialLength) {
            return false;
        }
        documents.length = 0;
        documents.push(...newDocuments);
        return true;
    },
};
