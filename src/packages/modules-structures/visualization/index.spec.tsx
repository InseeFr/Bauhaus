import { StructureView } from './index';
import { Provider } from 'react-redux';
import configureStore from '../../redux/configure-store';
import { renderWithAppContext } from '../../tests-utils/render';
import { Structure } from '../../model/structures/Structure';
import React from 'react';
import { DescriptionsPanel } from './components/descriptions-panel';
import { GlobalInformationsPanel } from './components/global-informations-panel';
import { ComponentsPanel } from './components/components-panel';

jest.mock('./components/global-informations-panel', () => ({
	GlobalInformationsPanel: jest.fn(() => <div></div>),
}));

jest.mock('./components/descriptions-panel', () => ({
	DescriptionsPanel: jest.fn(() => <div></div>),
}));

jest.mock('./components/components-panel', () => ({
	ComponentsPanel: jest.fn(() => <div></div>),
}));

const store = configureStore({
	users: {
		results: {
			stamp: 'stamp',
		},
	},
	app: {
		auth: {
			user: {
				roles: [],
			},
		},
	},
});

describe('<StructureView />', () => {
	it('should display labelLg1', () => {
		const { container } = renderWithAppContext(
			<Provider store={store}>
				<StructureView
					publish={jest.fn()}
					structure={
						{
							labelLg1: 'labelLg1',
						} as Structure
					}
				></StructureView>
			</Provider>
		);

		expect(container.querySelector('h2')!.innerHTML).toEqual('labelLg1');
	});
	it('should call sub components properly', () => {
		renderWithAppContext(
			<Provider store={store}>
				<StructureView
					publish={jest.fn()}
					structure={
						{
							labelLg1: 'labelLg1',
							descriptionLg1: 'descriptionLg1',
							descriptionLg2: 'descriptionLg2',
						} as Structure
					}
				></StructureView>
			</Provider>
		);
		expect((GlobalInformationsPanel as jest.Mock).mock.calls).toHaveLength(1);
		expect((DescriptionsPanel as jest.Mock).mock.calls).toHaveLength(1);
		expect(
			(DescriptionsPanel as jest.Mock).mock.calls[0][0].descriptionLg1
		).toBe('descriptionLg1');
		expect(
			(DescriptionsPanel as jest.Mock).mock.calls[0][0].descriptionLg2
		).toBe('descriptionLg2');
		expect((ComponentsPanel as jest.Mock).mock.calls).toHaveLength(1);
	});
});
