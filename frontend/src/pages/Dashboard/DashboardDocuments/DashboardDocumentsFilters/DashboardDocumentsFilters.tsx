import { Style as S } from "./DashboardDocumentsFilters.style";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import useDashboardDocumentFilters from "./DashboardDocumentFilters.hook";

const DashboardDocumentsFilters = () => {
  const { onChangeSearch, search } = useDashboardDocumentFilters();
  return (
    <S.Container>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search documents by title or type..."
        className="pl-10 w-full max-w-md"
        value={search}
        onChange={onChangeSearch}
      />
    </S.Container>
  );
};

export default DashboardDocumentsFilters;
