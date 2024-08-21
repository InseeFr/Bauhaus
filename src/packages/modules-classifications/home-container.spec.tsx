import { render, screen } from '@testing-library/react';
import { useClassifications } from '../utils/hooks/classifications';
import ClassificationsHomeContainer from './home-container';

jest.mock('../utils/hooks/classifications');

jest.mock('../components', () => ({
	Loading: () => <div data-testid="loading">Loading...</div>,
}));

jest.mock('./home', () => ({
	__esModule: true,
	default: ({ classifications }) => (
		<div data-testid="classifications-home">
			{classifications.map((classification) => (
				<div key={classification.id}>{classification.name}</div>
			))}
		</div>
	),
}));

describe('ClassificationsHomeContainer', () => {
	it('should render Loading component when data is loading', () => {
		(useClassifications as jest.Mock).mockReturnValue({
			isLoading: true,
			data: null,
		});

		render(<ClassificationsHomeContainer />);

		screen.getByTestId('loading');
	});

	it('should render ClassificationsHome component with classifications data when loading is complete', () => {
		const mockClassifications = [
			{ id: 1, name: 'Classification 1' },
			{ id: 2, name: 'Classification 2' },
		];

		(useClassifications as jest.Mock).mockReturnValue({
			isLoading: false,
			data: mockClassifications,
		});

		render(<ClassificationsHomeContainer />);

		screen.getByTestId('classifications-home');
		screen.getByText('Classification 1');
		screen.getByText('Classification 2');
	});
});
