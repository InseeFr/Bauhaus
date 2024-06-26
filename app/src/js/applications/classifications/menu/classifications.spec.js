import { render } from '@testing-library/react';
import MenuClassifications from '.';
import { MemoryRouter } from 'react-router-dom';

describe('menu-classifications', () => {
	it('renders without crashing', () => {
		render(<MenuClassifications />, { wrapper: MemoryRouter });
	});
});
