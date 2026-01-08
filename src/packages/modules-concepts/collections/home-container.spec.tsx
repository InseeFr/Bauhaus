import { render, screen } from '@testing-library/react';
import { Mock, vi } from 'vitest';

import { Component } from './home-container';
import { useCollections } from '../hooks/useCollections';

vi.mock('../hooks/useCollections', () => ({
	useCollections: vi.fn(),
}));

vi.mock('@components/loading', () => ({
	Loading: () => <div data-testid="loading">Loading...</div>,
}));

vi.mock('./home', () => ({
	default: ({ collections }: { collections: any[] }) => (
		<div data-testid="collections-home">{JSON.stringify(collections)}</div>
	),
}));

describe('Component', () => {
	it('renders the Loading component when isLoading is true', () => {
		(useCollections as Mock).mockReturnValue({
			isLoading: true,
			data: null,
		});

		render(<Component />);

		screen.getByTestId('loading');
	});

	it('renders the CollectionsHome component when isLoading is false', () => {
		const mockCollections = [
			{ id: 1, label: { value: 'Collection 1', lang: 'fr' } },
			{ id: 2, label: { value: 'Collection 2', lang: 'fr' } },
		];

		(useCollections as Mock).mockReturnValue({
			isLoading: false,
			data: mockCollections,
		});

		render(<Component />);

		const home = screen.getByTestId('collections-home');
		expect(home.innerText).toContain(
			JSON.stringify([
				{ id: 1, label: 'Collection 1' },
				{ id: 2, label: 'Collection 2' },
			]),
		);
	});
});
