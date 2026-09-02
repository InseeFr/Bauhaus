import { useQuery } from "@tanstack/react-query";

import { Document } from "@model/operations/document";

import { DocumentsApi } from "@sdk/documents";

export const useDocumentsAndLinks = () => {
  return useQuery({
    queryKey: ["documents"],
    queryFn: () => {
      return DocumentsApi.getDocumentsAndLinksList() as Promise<Document[]>;
    },
  });
};
