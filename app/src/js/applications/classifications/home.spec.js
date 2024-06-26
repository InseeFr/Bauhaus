import { render } from '@testing-library/react';
import Home from './home';
import { MemoryRouter } from 'react-router-dom';

const classifications = [{ id: '1', label: 'Classification 1' }];

describe('classifications-home', () => {
	it('renders without crashing', () => {
		render(<Home classifications={classifications} />, {
			wrapper: MemoryRouter,
		});
	});
});
