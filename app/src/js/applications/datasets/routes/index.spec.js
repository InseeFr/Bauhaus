import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DatasetsComponent from './index';

jest.mock('./menu', () => () => 'Menu');
jest.mock('../datasets/home/home', () => () => 'DatasetHome');
jest.mock('../datasets/edit', () => () => 'DatasetEdit');
jest.mock('../datasets/view/view', () => () => 'DatasetView');
jest.mock('../distributions/home/home', () => () => 'DistributionHome');
jest.mock('../distributions/edit', () => () => 'DistributionEdit');
jest.mock('../distributions/view/view', () => () => 'DistributionView');

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
