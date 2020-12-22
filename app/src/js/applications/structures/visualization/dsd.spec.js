import React from 'react';
import {StructureView} from './dsd';
import { render } from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({
	app: {
		secondLang: true
	}
});

describe('<StructureView />', () => {
	it("should display labelLg1", () => {
		const { container } = render(
			<Provider store={store}>
				<MemoryRouter>
					<StructureView
						structure={{
							labelLg1: 'labelLg1'
						}}
					></StructureView>
				</MemoryRouter>
			</Provider>
		);

		expect(container.querySelector('h1').innerHTML).toEqual('labelLg1');
	})
	it("should display the general informations block", () => {
		const { container } = render(
			<Provider store={store}>
				<MemoryRouter>
					<StructureView
						structure={{
							created: new Date('2020-01-01'),
							modified: new Date('2020-01-01'),
							validationState: 'Validated',
							contributor: 'STAMP CONTRIBUTOR',
							creator: 'STAMP CREATOR',
							disseminationStatus: "http://id.insee.fr/codes/base/statutDiffusion/PublicGenerique"
						}}
					></StructureView>
				</MemoryRouter>
			</Provider>
		);

		expect(container.querySelector('ul li:nth-child(1)').innerHTML).toContain('Date de création : 01/01/2020');
		expect(container.querySelector('ul li:nth-child(2)').innerHTML).toContain('Date de modification : 01/01/2020');
		expect(container.querySelector('ul li:nth-child(3)').innerHTML).toContain('Publication status : Validated');
		expect(container.querySelector('ul li:nth-child(4)').innerHTML).toContain('Creator : STAMP CREATOR');
		expect(container.querySelector('ul li:nth-child(5)').innerHTML).toContain('Contributor : STAMP CONTRIBUTOR');
		expect(container.querySelector('ul li:nth-child(6)').innerHTML).toContain('Diffusion status : Public generic');
	})
})
