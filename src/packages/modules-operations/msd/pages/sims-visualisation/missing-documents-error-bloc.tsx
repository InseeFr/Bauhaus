import { ErrorBloc } from '@components/errors-bloc';
import { useDocumentsStoreContext } from '../sims-creation/documents-store-context';
import D from '../../../../deprecated-locales';

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
}: Readonly<{
	missingDocuments: Set<string>;
}>) => {
	const { documentStores: documentStoresObject } = useDocumentsStoreContext();
	const documentStores = documentStoresObject
		? Object.values(documentStoresObject).flat()
		: [];

	if (!missingDocuments || missingDocuments?.size === 0) return null;
	if (documentStores.length === 0) return null;

	return (
		<ErrorBloc
			error={D.missingDocumentWhenExportingSims(
				Array.from(missingDocuments).map(
					(id) => documentStores.find((d) => d.id === id)?.labelLg1,
				),
			)}
			D={D}
		/>
	);
};
