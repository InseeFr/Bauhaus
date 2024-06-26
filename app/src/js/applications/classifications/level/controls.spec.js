import { render } from '@testing-library/react';
import Controls from './controls';
import { MemoryRouter } from 'react-router-dom';

describe('classification-level-controls', () => {
	it('renders without crashing', () => {
		render(<Controls id="nafr2" />, { wrapper: MemoryRouter });
	});
});
