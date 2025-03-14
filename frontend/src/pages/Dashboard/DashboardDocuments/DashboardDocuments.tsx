import { Style as S } from "./DashboardDocuments.style";
import DashboardDocumentsFilters from "./DashboardDocumentsFilters/DashboardDocumentsFilters";
import DashboardDocumentsGrid from "./DashboardDocumentsGrid/DashboardDocumentsGrid";

export default function DashboardDocuments() {
  return (
    <S.Container>
      <DashboardDocumentsFilters />
      <DashboardDocumentsGrid />
    </S.Container>
  );
}
