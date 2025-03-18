import { render, screen } from '@testing-library/react';
import { Mock, vi } from 'vitest';

import { useClassifications } from '@utils/hooks/classifications';

import { PartialClassification } from '../model/Classification';
import { Component } from './home-container';

vi.mock('@utils/hooks/classifications', () => ({
	useClassifications: vi.fn(),
}));

vi.mock('@components/loading', () => ({
	Loading: () => <div data-testid="loading">Loading...</div>,
}));

vi.mock('./home', () => ({
	default: ({
		classifications,
	}: {
		classifications: PartialClassification[];
	}) => (
		<div data-testid="classifications-home">
			{JSON.stringify(classifications)}
		</div>
	),
}));

describe('Component', () => {
	it('renders the Loading component when isLoading is true', () => {
		(useClassifications as Mock).mockReturnValue({
			isLoading: true,
			data: null,
		});

		render(<Component />);

		screen.getByTestId('loading');
	});

	it('renders the ClassificationsHome component when isLoading is false', () => {
		const mockClassifications = [
			{ id: 1, name: 'Classification 1' },
			{ id: 2, name: 'Classification 2' },
		];

		(useClassifications as Mock).mockReturnValue({
			isLoading: false,
			data: mockClassifications,
		});

		render(<Component />);

		const home = screen.getByTestId('classifications-home');
		expect(home.innerText).toContain(JSON.stringify(mockClassifications));
	});
});
