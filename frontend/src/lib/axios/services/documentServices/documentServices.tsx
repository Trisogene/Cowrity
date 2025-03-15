import { axiosClient } from "../../axios";
import { Document } from "./documentServices.d";

const getDocuments = async (): Promise<Document[]> => {
  const response = await axiosClient.get(`/documents`);
  return response.data;
};

const getDocumentById = async (id: string): Promise<Document> => {
  const response = await axiosClient.get(`/documents/${id}`);
  return response.data;
};

const createDocument = async (
  document: Omit<Document, "id" | "createdAt">
): Promise<Document> => {
  const response = await axiosClient.post(`/documents`, document);
  return response.data;
};

const updateDocument = async (
  id: string,
  document: Partial<Document>
): Promise<Document> => {
  const response = await axiosClient.put(`/documents/${id}`, document);
  return response.data;
};

const deleteDocument = async (id: string): Promise<void> => {
  await axiosClient.delete(`/documents/${id}`);
};

export const documentServices = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
