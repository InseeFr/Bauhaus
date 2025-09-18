import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { MissingDocumentsErrorBloc } from './missing-documents-error-bloc';
import { DocumentsStoreProvider } from '../sims-creation/documents-store-context';

vi.mock('@components/errors-bloc', () => ({
	ErrorBloc: ({ error }: { error: string }) => (
		<div data-testid="error-bloc">{error}</div>
	),
}));

vi.mock('../../../../deprecated-locales', () => ({
	default: {
		missingDocumentWhenExportingSims: (labels: (string | undefined)[]) =>
			`Missing documents: ${labels.filter(Boolean).join(', ')}`,
	},
}));

const mockDocumentStores = [
	{ id: '1', labelLg1: 'Document 1', labelLg2: 'Document 1 EN', lang: 'fr' },
	{ id: '2', labelLg1: 'Document 2', labelLg2: 'Document 2 EN', lang: 'fr' },
	{ id: '3', labelLg1: 'Document 3', labelLg2: 'Document 3 EN', lang: 'fr' },
];

const mockContextValue = {
	documentStores: { lg1: mockDocumentStores, lg2: [] },
	updateDocumentStores: vi.fn(),
	rubricIdForNewDocument: null,
	setRubricIdForNewDocument: vi.fn(),
};

const renderWithContext = (component: React.ReactElement) => {
	return render(
		<DocumentsStoreProvider value={mockContextValue}>
			{component}
		</DocumentsStoreProvider>,
	);
};

describe('MissingDocumentsErrorBloc', () => {
	it('renders error bloc when there are missing documents', () => {
		const missingDocuments = new Set(['1', '2']);

		renderWithContext(
			<MissingDocumentsErrorBloc missingDocuments={missingDocuments} />,
		);

		const errorBloc = screen.getByTestId('error-bloc');
		expect(errorBloc).toHaveTextContent(
			'Missing documents: Document 1, Document 2',
		);
	});

	it('returns null when there are no missing documents', () => {
		const missingDocuments = new Set<string>();

		const { container } = renderWithContext(
			<MissingDocumentsErrorBloc missingDocuments={missingDocuments} />,
		);

		expect(container.firstChild).toBeNull();
	});

	it('returns null when missingDocuments is undefined', () => {
		const { container } = renderWithContext(
			<MissingDocumentsErrorBloc missingDocuments={undefined as any} />,
		);

		expect(container.firstChild).toBeNull();
	});

	it('returns null when document stores is empty', () => {
		const missingDocuments = new Set(['1', '2']);
		const emptyContextValue = {
			...mockContextValue,
			documentStores: { lg1: [], lg2: [] },
		};

		render(
			<DocumentsStoreProvider value={emptyContextValue}>
				<MissingDocumentsErrorBloc missingDocuments={missingDocuments} />
			</DocumentsStoreProvider>,
		);

		expect(screen.queryByTestId('error-bloc')).not.toBeInTheDocument();
	});

	it('returns null when documentStores is null', () => {
		const missingDocuments = new Set(['1', '2']);
		const nullContextValue = {
			...mockContextValue,
			documentStores: null as any,
		};

		render(
			<DocumentsStoreProvider value={nullContextValue}>
				<MissingDocumentsErrorBloc missingDocuments={missingDocuments} />
			</DocumentsStoreProvider>,
		);

		expect(screen.queryByTestId('error-bloc')).not.toBeInTheDocument();
	});

	it('handles missing documents that are not found in store', () => {
		const missingDocuments = new Set(['1', '999']); // '999' doesn't exist in store

		renderWithContext(
			<MissingDocumentsErrorBloc missingDocuments={missingDocuments} />,
		);

		const errorBloc = screen.getByTestId('error-bloc');
		expect(errorBloc).toHaveTextContent('Missing documents: Document 1');
	});

	it('handles when all missing documents are not found in store', () => {
		const missingDocuments = new Set(['999', '888']); // Neither exist in store

		renderWithContext(
			<MissingDocumentsErrorBloc missingDocuments={missingDocuments} />,
		);

		const errorBloc = screen.getByTestId('error-bloc');
		expect(errorBloc).toHaveTextContent('Missing documents:');
	});
});
