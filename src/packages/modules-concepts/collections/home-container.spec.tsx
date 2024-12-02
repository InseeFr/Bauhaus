import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { CollectionApi } from '../../sdk/collection-api';
import CollectionsHome from './home';
import { Component } from './home-container';

vi.mock('../../components', () => ({
	Loading: vi.fn(() => <div>Loading...</div>),
}));

vi.mock('./home', () => ({
	default: vi.fn(() => <div>CollectionsHome</div>),
}));

vi.mock('../../sdk/collection-api', () => ({
	CollectionApi: {
		getCollectionList: vi.fn(),
	},
}));

describe('Component', () => {
	const mockCollections = [
		{ id: '1', label: 'Collection 1' },
		{ id: '2', label: 'Collection 2' },
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should show the loading spinner initially', () => {
		// Simuler une promesse qui ne se résout pas immédiatement
		CollectionApi.getCollectionList.mockImplementation(
			() => new Promise(() => {}),
		);

		render(<Component />);

		screen.getByText('Loading...');
	});

	it('should render CollectionsHome after data is loaded', async () => {
		CollectionApi.getCollectionList.mockResolvedValue(mockCollections);

		render(<Component />);

		screen.getByText('Loading...');

		await waitFor(() =>
			expect(CollectionApi.getCollectionList).toHaveBeenCalled(),
		);

		screen.getByText('CollectionsHome');
	});

	it('should pass the collections data to CollectionsHome', async () => {
		CollectionApi.getCollectionList.mockResolvedValue(mockCollections);

		render(<Component />);

		await waitFor(() => screen.getByText('CollectionsHome'));

		expect(CollectionsHome).toHaveBeenCalledWith(
			expect.objectContaining({
				collections: mockCollections,
			}),
			{},
		);
	});
});
