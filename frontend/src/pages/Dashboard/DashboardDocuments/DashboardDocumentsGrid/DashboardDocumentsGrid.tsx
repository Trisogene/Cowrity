import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import useDashboardDocumentsGrid from "./DashboardDocumentsGrid.hook";
import { Style as S } from "./DashboardDocumentsGrid.style";

export default function DashboardDocumentsGrid() {
  const { getDocumentIcon, filteredDocuments, formatDate, onClickDocument } =
    useDashboardDocumentsGrid();

  return (
    <>
      {filteredDocuments.length === 0 ? (
        <S.EmptyStateContainer>
          <S.EmptyStateText>
            No documents found matching your search.
          </S.EmptyStateText>
        </S.EmptyStateContainer>
      ) : (
        <S.DocumentGrid>
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:bg-accent/50 transition-colors">
              <CardContent className="p-3 flex items-center justify-between">
                <S.DocumentContent>
                  <S.DocumentIconContainer>
                    {getDocumentIcon(doc.type)}
                  </S.DocumentIconContainer>
                  <S.DocumentInfo>
                    <S.DocumentTitle>{doc.title}</S.DocumentTitle>
                    <S.DocumentMeta>
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {doc.type}
                      </Badge>
                      <S.DocumentDate>
                        {formatDate(doc.createdAt)}
                      </S.DocumentDate>
                    </S.DocumentMeta>
                  </S.DocumentInfo>
                </S.DocumentContent>
                <S.DocumentActions>
                  <Button
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onClickDocument(doc.id)}
                  >
                    <ArrowRight />
                  </Button>
                </S.DocumentActions>
              </CardContent>
            </Card>
          ))}
        </S.DocumentGrid>
      )}
    </>
  );
}
