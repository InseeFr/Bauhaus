import { render, screen } from '@testing-library/react';
import DatasetsMenu from './menu';
import { MemoryRouter } from 'react-router-dom';

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
