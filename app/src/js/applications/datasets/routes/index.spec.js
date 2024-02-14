import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DatasetsComponent from './index';

jest.mock('./menu', () => () => 'Menu');
jest.mock('../datasets/home', () => () => 'DatasetHome');
jest.mock('../datasets/edit', () => () => 'DatasetEdit');
jest.mock('../datasets/view', () => () => 'DatasetView');
jest.mock('../distributions/home', () => () => 'DistributionHome');
jest.mock('../distributions/edit', () => () => 'DistributionEdit');
jest.mock('../distributions/view', () => () => 'DistributionView');

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
