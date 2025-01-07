import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { ConceptsApi } from '../sdk';
import { renderWithRouter } from '../tests-utils/render';
import { Component } from './home';

vi.mock('../sdk', () => ({
	ConceptsApi: {
		getConceptList: vi.fn(),
	},
}));

vi.mock('./menu', () => ({
	Menu: () => <div data-testid="mock-menu">Mock Menu</div>,
}));

describe('Component (home.tsx)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders the loading state initially', () => {
		ConceptsApi.getConceptList.mockReturnValue(new Promise(() => {}));

		render(<Component />);

		screen.getByText(/loading/i);
	});

	it('renders the list of concepts after data is loaded', async () => {
		const mockConcepts = [
			{ id: 1, label: 'Concept 1' },
			{ id: 2, label: 'Concept 2' },
		];
		ConceptsApi.getConceptList.mockResolvedValue(mockConcepts);

		renderWithRouter(<Component />);

		await waitFor(() => expect(screen.queryByText(/loading/i)).toBeNull());

		screen.getByPlaceholderText(/label/i);
		mockConcepts.forEach((concept) => {
			screen.getByText(concept.label);
		});
	});
});
