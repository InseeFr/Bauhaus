import { useQuery } from "@tanstack/react-query";

import { DocumentsApi } from "@sdk/documents";

import { Document } from "../../model/operations/document";

export const useDocumentsAndLinks = () => {
  return useQuery({
    queryKey: ["documents"],
    queryFn: () => {
      return DocumentsApi.getDocumentsAndLinksList() as Promise<Document[]>;
    },
  });
};
