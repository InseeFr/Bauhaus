import { StructureView } from './index';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../../../store/configure-store';

const store = configureStore({
	users: {
		results: {
			stamp: 'stamp',
		},
	},
	app: {
		secondLang: true,
		auth: {
			user: {
				roles: [],
			},
		},
	},
	stampList: {
		results: [],
	},
});

describe('<StructureView />', () => {
	it('should display labelLg1', () => {
		const { container } = render(
			<Provider store={store}>
				<MemoryRouter>
					<StructureView
						structure={{
							labelLg1: 'labelLg1',
						}}
					></StructureView>
				</MemoryRouter>
			</Provider>
		);

		expect(container.querySelector('h2').innerHTML).toEqual('labelLg1');
	});
	it('should display the general informations block', () => {
		const { container } = render(
			<Provider store={store}>
				<MemoryRouter>
					<StructureView
						structure={{
							identifiant: '1234',
							created: new Date('2020-01-01'),
							modified: new Date('2020-01-01'),
							validationState: 'Validated',
							contributor: 'STAMP CONTRIBUTOR',
							creator: 'STAMP CREATOR',
							disseminationStatus:
								'http://id.insee.fr/codes/base/statutDiffusion/PublicGenerique',
						}}
					></StructureView>
				</MemoryRouter>
			</Provider>
		);
		expect(container.querySelector('ul li:nth-child(1)').innerHTML).toContain(
			'1234'
		);
		expect(container.querySelector('ul li:nth-child(2)').innerHTML).toContain(
			'Creation date : 01/01/2020'
		);
		expect(container.querySelector('ul li:nth-child(3)').innerHTML).toContain(
			'Modification date : 01/01/2020'
		);
		expect(container.querySelector('ul li:nth-child(4)').innerHTML).toContain(
			'Publication status : Published'
		);
		expect(container.querySelector('ul li:nth-child(5)').innerHTML).toContain(
			'Creator : STAMP CREATOR'
		);
		expect(container.querySelector('ul li:nth-child(6)').innerHTML).toContain(
			'Contributor :<ul><li>STAMP CONTRIBUTOR</li></ul>'
		);
		expect(container.querySelector('ul li:nth-child(7)').innerHTML).toContain(
			'Dissemination status : Public generic'
		);
	});
});
