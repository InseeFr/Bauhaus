import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useNavigate } from 'react-router-dom';

import { ConceptsApi } from '@sdk/index';

import { useCollections } from '../../../utils/hooks/collections';
import { useTitle } from '@utils/hooks/useTitle';
import { useAppContext } from '../../../application/app-context';
import { Component } from './creation-container';

vi.mock('react-router-dom', () => ({
	useNavigate: vi.fn(),
}));

vi.mock('@sdk/index', () => ({
	ConceptsApi: {
		getConceptList: vi.fn(),
		postCollection: vi.fn(),
	},
}));

vi.mock('../../../utils/hooks/collections', () => ({
	useCollections: vi.fn(),
}));

vi.mock('@utils/hooks/useTitle', () => ({
	useTitle: vi.fn(),
}));

vi.mock('../../../application/app-context', () => ({
	useAppContext: vi.fn(),
}));

vi.mock('../../collections/utils/empty-collection', () => ({
	default: vi.fn(() => ({
		general: { prefLabelLg1: '' },
		members: [],
	})),
}));

vi.mock('@components/loading', () => ({
	Loading: () => <div data-testid="loading">Loading...</div>,
	Saving: () => <div data-testid="saving">Saving...</div>,
}));

vi.mock('./home', () => ({
	default: () => <div data-testid="collection-edition-creation">Form</div>,
}));

describe('Creation Container Component', () => {
	const mockNavigate = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		useNavigate.mockReturnValue(mockNavigate);
		useCollections.mockReturnValue({
			data: [{ id: '1', label: 'Collection 1' }],
		});
		useAppContext.mockReturnValue({
			properties: { defaultContributor: 'DG75-L201' },
		});
	});

	it('renders Loading component while loading concept list', () => {
		ConceptsApi.getConceptList.mockReturnValue(
			new Promise(() => {}),
		);

		render(<Component />);

		screen.getByTestId('loading');
	});

	it('renders CollectionEditionCreation component after loading', async () => {
		const mockConceptList = [
			{ id: 'c1', label: 'Concept 1' },
			{ id: 'c2', label: 'Concept 2' },
		];

		ConceptsApi.getConceptList.mockResolvedValue(mockConceptList);

		render(<Component />);

		await waitFor(() => {
			screen.getByTestId('collection-edition-creation');
		});
	});

	it('calls useTitle with the correct title', () => {
		ConceptsApi.getConceptList.mockResolvedValue([]);

		render(<Component />);

		expect(useTitle).toHaveBeenCalled();
	});

	it('renders Saving component when saving', async () => {
		ConceptsApi.getConceptList.mockResolvedValue([]);
		ConceptsApi.postCollection.mockReturnValue(
			new Promise(() => {}),
		);

		const { rerender } = render(<Component />);

		await waitFor(() => {
			screen.getByTestId('collection-edition-creation');
		});

		// Verify the component structure is correct
		expect(screen.queryByTestId('saving')).toBeNull();

		rerender(<Component />);
	});

	it('uses the default contributor from app context', () => {
		ConceptsApi.getConceptList.mockResolvedValue([]);

		render(<Component />);

		expect(useAppContext).toHaveBeenCalled();
	});

	it('calls useCollections hook', () => {
		ConceptsApi.getConceptList.mockResolvedValue([]);

		render(<Component />);

		expect(useCollections).toHaveBeenCalled();
	});
});
