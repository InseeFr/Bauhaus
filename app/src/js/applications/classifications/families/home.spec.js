import { render } from '@testing-library/react';
import Home from './home';
import { MemoryRouter } from 'react-router-dom';

const families = [{ id: '1', label: 'Family 1' }];

describe('families-home', () => {
	it('renders without crashing', () => {
		render(<Home families={families} />, {
			wrapper: MemoryRouter,
		});
	});
});
