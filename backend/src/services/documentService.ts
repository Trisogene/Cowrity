import { v4 as uuidV4 } from "uuid";

export interface Document {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  content?: string; // Optional content field for the document
}

// You can also add document types as an enum for better type safety
export enum DocumentType {
  DOCUMENT = "document",
  SPREADSHEET = "spreadsheet",
  PDF = "pdf",
  IMAGE = "image",
}

// Initial set of mock documents
const documents: Document[] = [
  {
    id: uuidV4(),
    title: "Q1 Financial Report",
    type: DocumentType.SPREADSHEET,
    createdAt: new Date().toISOString(),
    content: "# Q1 Financial Report\n\nThis is a sample financial report.",
  },
  {
    id: uuidV4(),
    title: "Product Roadmap 2024",
    type: DocumentType.DOCUMENT,
    createdAt: new Date().toISOString(),
    content: "# Product Roadmap\n\n## Q1 Goals\n- Feature A\n- Feature B",
  },
  {
    id: uuidV4(),
    title: "Marketing Campaign Assets",
    type: DocumentType.IMAGE,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidV4(),
    title: "Legal Contract Template",
    type: DocumentType.PDF,
    createdAt: new Date().toISOString(),
  },
];

export const documentService = {
  getAllDocuments: (): Document[] => {
    return documents;
  },

  getDocumentById: (id: string): Document | undefined => {
    return documents.find((doc) => doc.id === id);
  },

  createDocument: (doc: Omit<Document, "id" | "createdAt">): Document => {
    const newDocument: Document = {
      ...doc,
      id: uuidV4(),
      createdAt: new Date().toISOString(),
    };

    documents.push(newDocument);
    return newDocument;
  },

  updateDocument: (
    id: string,
    docData: Partial<Document>
  ): Document | undefined => {
    const index = documents.findIndex((doc) => doc.id === id);
    if (index === -1) return undefined;

    documents[index] = { ...documents[index], ...docData };
    return documents[index];
  },

  deleteDocument: (id: string): boolean => {
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
