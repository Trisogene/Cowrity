import tw from "tailwind-styled-components";

const Container = tw.div`
  grow-1 flex flex-col gap-4
`;

const HeaderSection = tw.div`
`;

const SearchContainer = tw.div`
  relative
`;

const EmptyStateContainer = tw.div`
  text-center py-6
`;

const EmptyStateText = tw.p`
  text-muted-foreground
`;

const DocumentGrid = tw.div`
  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3
`;

const DocumentContent = tw.div`
  flex items-center gap-3 min-w-0
`;

const DocumentIconContainer = tw.div`
  bg-muted rounded-md p-2
`;

const DocumentInfo = tw.div`
  min-w-0
`;

const DocumentTitle = tw.h3`
  font-medium text-sm truncate
`;

const DocumentMeta = tw.div`
  flex items-center gap-2 mt-1
`;

const DocumentDate = tw.span`
  text-xs text-muted-foreground
`;

const DocumentActions = tw.div`
  flex items-center gap-1 ml-2 shrink-0
`;

export const Style = {
  Container,
  HeaderSection,
  SearchContainer,
  EmptyStateContainer,
  EmptyStateText,
  DocumentGrid,
  DocumentContent,
  DocumentIconContainer,
  DocumentInfo,
  DocumentTitle,
  DocumentMeta,
  DocumentDate,
  DocumentActions,
};
