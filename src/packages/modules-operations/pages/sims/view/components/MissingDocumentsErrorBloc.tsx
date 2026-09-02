import { useTranslation } from "react-i18next";

import { ErrorBloc } from "@components/errors-bloc";

import { useDocumentsStoreContext } from "../../hooks/useDocumentsStoreContext";

/**
 * Component that displays an error bloc when there are missing documents during SIMS export.
 *
 * @param {Object} props - The component props
 * @param {Set<string>} props.missingDocuments - Set of document IDs that are missing
 *
 * @returns {JSX.Element | null} Returns an ErrorBloc component with missing document labels,
 *                              or null if no missing documents or document stores are empty
 *
 * @example
 * ```tsx
 * const missingDocs = new Set(['doc1', 'doc2']);
 * <MissingDocumentsErrorBloc missingDocuments={missingDocs} />
 * ```
 */
export const MissingDocumentsErrorBloc = ({
  missingDocuments,
  translationKey = "documents.missingDocumentWhenExportingSims",
}: Readonly<{
  missingDocuments: Set<string>;
  translationKey?: string;
}>) => {
  const { t } = useTranslation();

  const { documentStores: documentStoresObject } = useDocumentsStoreContext();

  const documentStores = documentStoresObject ? Object.values(documentStoresObject).flat() : [];

  if (!missingDocuments || missingDocuments?.size === 0) return null;

  if (documentStores.length === 0) return null;

  const documentStoresById = new Map(documentStores.map((d) => [d.id, d]));

  const documentNames = Array.from(missingDocuments).map(
    (id) => documentStoresById.get(id)?.labelLg1,
  );

  return (
    <ErrorBloc
      error={t(translationKey, {
        documentNames: documentNames.join("</li><li>"),
      })}
    />
  );
};
