import { v4 as uuidV4 } from "uuid";
export const MOCK_DOCUMENTS: Document[] = [
  {
    id: uuidV4(),
    title: "Q1 Financial Report",
    type: "spreadsheet",
    createdAt: "2024-03-10",
  },
  {
    id: uuidV4(),
    title: "Product Roadmap 2024",
    type: "document",
    createdAt: "2024-02-28",
  },
  {
    id: uuidV4(),
    title: "Marketing Campaign Assets",
    type: "image",
    createdAt: "2024-03-05",
  },
  {
    id: uuidV4(),
    title: "Legal Contract Template",
    type: "pdf",
    createdAt: "2024-01-15",
  },
  {
    id: uuidV4(),
    title: "Team Meeting Notes",
    type: "document",
    createdAt: "2024-03-12",
  },
  {
    id: uuidV4(),
    title: "User Research Findings",
    type: "spreadsheet",
    createdAt: "2024-02-20",
  },
  {
    id: uuidV4(),
    title: "Brand Guidelines",
    type: "pdf",
    createdAt: "2023-12-10",
  },
  {
    id: uuidV4(),
    title: "Product Photography",
    type: "image",
    createdAt: "2024-03-01",
  },
];

type Document = {
  id: string;
  title: string;
  type: string;
  createdAt: string;
};
