import { render, screen } from '@testing-library/react';
import { Mock, vi } from 'vitest';

import { useCollections } from '../../utils/hooks/collections';
import { Component } from './home-container';

vi.mock('../../utils/hooks/collections', () => ({
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
			{ id: 1, label: 'Collection 1' },
			{ id: 2, label: 'Collection 2' },
		];

		(useCollections as Mock).mockReturnValue({
			isLoading: false,
			data: mockCollections,
		});

		render(<Component />);

		const home = screen.getByTestId('collections-home');
		expect(home.innerText).toContain(JSON.stringify(mockCollections));
	});
});
