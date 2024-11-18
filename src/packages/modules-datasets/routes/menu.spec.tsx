import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import DatasetsMenu from './menu';

describe('Menu', () => {
	it('should contains three items', () => {
		render(
			<MemoryRouter initialEntries={['/datasets/distribution']}>
				<DatasetsMenu />
			</MemoryRouter>,
		);
		expect(screen.getAllByRole('link')).toHaveLength(3);
	});
});
