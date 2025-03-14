import {
  FileIcon as FilePdf,
  FileSpreadsheet,
  FileText,
  ImageIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_DOCUMENTS } from "./DashboardDocumentsGrid.mock";
import { useRtk } from "@/lib/rtk/store";

const useDashboardDocumentsGrid = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const searchQuery = useRtk((state) => state.dashboard.search);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/${roomId}`);
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="w-4 h-4" />;
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "spreadsheet":
        return <FileSpreadsheet className="w-4 h-4" />;
      case "pdf":
        return <FilePdf className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredDocuments = MOCK_DOCUMENTS.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const onClickDocument = (id: string) => {
    navigate(`/documents/${id}`);
  };

  return {
    roomId,
    setRoomId,
    navigate,
    handleSubmit,
    getDocumentIcon,
    filteredDocuments,
    formatDate,
    searchQuery,
    onClickDocument,
  };
};

export default useDashboardDocumentsGrid;
