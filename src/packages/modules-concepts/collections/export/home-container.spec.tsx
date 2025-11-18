import { render, screen } from '@testing-library/react';
import { Mock, vi } from 'vitest';

import { Picker } from '@components/picker-page';

import D from '../../../deprecated-locales/build-dictionary';
import { useCollectionExporter } from '../../../utils/hooks/collections';
import { useTitle } from '../../../utils/hooks/useTitle';
import { Component } from './home-container';
import { useCollections } from '../../hooks/useCollections';

vi.mock('../../hooks/useCollections', () => ({
	useCollections: vi.fn(),
}));

vi.mock('@utils/hooks/collections', () => ({
	useCollectionExporter: vi.fn(),
}));

vi.mock('@utils/hooks/useTitle', () => ({
	useTitle: vi.fn(),
}));

vi.mock('@components/picker-page', () => ({
	Picker: vi.fn(() => <div data-testid="picker-mock" />),
}));

vi.mock('@components/loading', () => ({
	Loading: () => <div data-testid="loading-mock" />,
	Exporting: () => <div data-testid="exporting-mock" />,
}));

describe('Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('displays the loader while loading collections', () => {
		(useCollections as Mock).mockReturnValue({
			data: [],
			isLoading: true,
		});
		(useCollectionExporter as Mock).mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		});

		render(<Component />);

		screen.getByTestId('loading-mock');
	});

	it('displays the loader during export', () => {
		(useCollections as Mock).mockReturnValue({
			data: [],
			isLoading: false,
		});
		(useCollectionExporter as Mock).mockReturnValue({
			mutate: vi.fn(),
			isPending: true,
		});

		render(<Component />);

		screen.getByTestId('exporting-mock');
	});

	it('displays Picker with the correct props after loading', () => {
		const collectionsMock = [{ id: 1, label: 'Collection 1' }];
		(useCollections as Mock).mockReturnValue({
			data: collectionsMock,
			isLoading: false,
		});
		(useCollectionExporter as Mock).mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		});

		render(<Component />);

		screen.getByTestId('picker-mock');
		expect(Picker).toHaveBeenCalledWith(
			expect.objectContaining({
				items: collectionsMock,
				title: D.exportTitle,
				panelTitle: D.collectionsExportPanelTitle,
				labelWarning: D.hasNotCollectionToExport,
				context: 'concepts/collections',
				disabled: true, // ids.length < 1
			}),
			{},
		);
	});

	it('calls useTitle with the correct titles', () => {
		render(<Component />);

		expect(useTitle).toHaveBeenCalledWith(D.collectionsTitle, D.exportTitle);
	});
});
