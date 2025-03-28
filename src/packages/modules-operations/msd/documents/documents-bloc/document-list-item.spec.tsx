import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Document } from '../../../../model/operations/document';
import { DocumentAsideInformation, DocumentLink } from './document-list-item';

describe('DocumentAsideInformation', () => {
	it('renders language and updatedDate correctly', () => {
		const mockDocument = {
			lang: 'en',
			updatedDate: '2024-01-01T10:00:00Z',
		} as Document;

		render(<DocumentAsideInformation document={mockDocument} />);

		screen.getByText('(en-1/1/2024)');
	});

	it('renders only language if updatedDate is missing', () => {
		const mockDocument = {
			lang: 'fr',
		} as Document;

		render(<DocumentAsideInformation document={mockDocument} />);

		screen.getByText('(fr)');
	});
});

describe('DocumentLink', () => {
	it('renders a link with correct href for documents', () => {
		const mockDocument = {
			uri: 'http://example.com/document/123',
			labelLg1: 'Document Label',
		} as Document;
		const baseURI = 'http://example.com/api';
		const localPrefix = 'Lg1';

		render(
			<DocumentLink
				document={mockDocument}
				localPrefix={localPrefix}
				baseURI={baseURI}
			/>,
		);

		const link = screen.getByRole('link', { name: 'Document Label' });

		expect(link.getAttribute('href')).toBe(
			'http://example.com/api/documents/document/123/file',
		);
		expect(link.getAttribute('target')).toBe('_blank');
		expect(link.getAttribute('rel')).toBe('noreferrer noopener');
	});

	it('renders a link with document.url if it is not a document', () => {
		const mockDocument = {
			uri: 'http://example.com/resource/1',
			url: 'http://example.com/resource',
			labelLg2: 'External Resource',
		} as Document;
		const baseURI = 'http://example.com';
		const localPrefix = 'Lg2';

		render(
			<DocumentLink
				document={mockDocument}
				localPrefix={localPrefix}
				baseURI={baseURI}
			/>,
		);

		const link = screen.getByRole('link', { name: 'External Resource' });

		expect(link.getAttribute('href')).toBe('http://example.com/resource');
	});

	it('uses the correct label priority', () => {
		const mockDocument = {
			uri: 'http://example.com/document/456',
			labelLg1: 'Primary Label',
			labelLg2: 'Secondary Label',
		} as Document;
		const baseURI = 'http://example.com';
		const localPrefix = 'Lg2';

		render(
			<DocumentLink
				document={mockDocument}
				localPrefix={localPrefix}
				baseURI={baseURI}
			/>,
		);

		screen.getByRole('link', { name: 'Secondary Label' });
	});

	it('sets title attribute based on the description', () => {
		const mockDocument = {
			uri: 'http://example.com/document/789',
			labelLg1: 'Document with Description',
			descriptionLg1: 'This is a test document',
		} as Document;
		const baseURI = 'http://example.com';
		const localPrefix = 'Lg1';

		render(
			<DocumentLink
				document={mockDocument}
				localPrefix={localPrefix}
				baseURI={baseURI}
			/>,
		);

		const link = screen.getByRole('link', {
			name: 'Document with Description',
		});

		expect(link.getAttribute('title')).toBe('This is a test document');
	});
});
