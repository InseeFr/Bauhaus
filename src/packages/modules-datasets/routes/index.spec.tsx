import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DatasetsComponent from './index';
import { vi } from 'vitest';


vi.mock('./menu', () => {
	return { default: () => 'Menu'}
});
vi.mock('../datasets/home/home', () => ({DatasetHome: () => 'DatasetHome'}));
vi.mock('../datasets/edit/edit', () => ({DatasetEdit:() => 'DatasetEdit'}));
vi.mock('../datasets/view/view', () => ({DatasetView:() => 'DatasetView'}));
vi.mock('../distributions/home/home', () => ({DistributionHome: () => 'DistributionHome'}));
vi.mock('../distributions/edit', () => ({DistributionEdit: () => 'DistributionEdit'}));
vi.mock('../distributions/view/view', () => ({DistributionView: () => 'DistributionView'}));

describe('Router', () => {
	it('should display the menu', () => {
		render(
			<MemoryRouter initialEntries={['/datasets/distribution']}>
				<DatasetsComponent />
			</MemoryRouter>
		);
		screen.getByText('Menu');
	});
});
