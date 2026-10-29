import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { Document } from "@model/operations/document";

import { DocumentsApi } from "@sdk/documents";
import { GeneralApi } from "@sdk/general-api";

/**
 * Préfixe commun à la liste des documents et liens (`["documents"]`) et aux fiches
 * (`["documents", type, id]`) : l'invalider périme les deux.
 */
const DOCUMENTS_KEY = ["documents"];

export const useDocumentsAndLinks = () => {
  return useQuery({
    queryKey: DOCUMENTS_KEY,
    queryFn: () => {
      return DocumentsApi.getDocumentsAndLinksList() as Promise<Document[]>;
    },
  });
};

/** Fiche d'un document ou d'un lien (`type`), dont l'identifiant est dérivé de l'URI. */
export const useDocument = (id: string | undefined, type: string) =>
  useQuery<Document>({
    enabled: !!id,
    queryKey: [...DOCUMENTS_KEY, type, id],
    queryFn: async () => {
      const document = (await GeneralApi.getDocument(id, type)) as Document;
      return { ...document, id: document.uri!.substring(document.uri!.lastIndexOf("/") + 1) };
    },
  });

/**
 * Périme les documents et liens en cache : à appeler après l'enregistrement d'un document ou d'un
 * lien. Les requêtes affichées sont relancées, la promesse se résout quand elles ont abouti.
 */
export const useInvalidateDocuments = () => {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: DOCUMENTS_KEY }),
    [queryClient],
  );
};
