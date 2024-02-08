import { fireEvent, render, screen } from '@testing-library/react';
import ConceptVisualizationContainer from './home-container';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import api from '../../../remote-api/concepts-api';
import * as R from 'bauhaus-utilities/src/auth/roles';

jest.mock('../../../remote-api/concepts-api');

const mockStore = configureStore([]);
const store = mockStore({
	app: {
		auth: {
			type: 'type',
			user: {
				roles: [R.ADMIN],
				stamp: 'stamp',
			},
		},
		lg1: 'fr',
		lg2: 'en',
	},
});

describe('ConceptVisualizationContainer', () => {
	it('should display the component', async () => {
		api.getConceptGeneral = jest.fn().mockImplementation(() => {
			return Promise.resolve({
				conceptVersion: 1,
			});
		});
		api.getNoteVersionList = jest.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});
		api.getConceptLinkList = jest.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});
		render(
			<Provider store={store}>
				<MemoryRouter>
					<ConceptVisualizationContainer />
				</MemoryRouter>
			</Provider>
		);

		expect(api.getConceptGeneral).toHaveBeenCalled();
	});

	it('should publish the component', async () => {
		api.getConceptGeneral = jest.fn().mockImplementation(() => {
			return Promise.resolve({
				conceptVersion: 1,
			});
		});
		api.getNoteVersionList = jest.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});
		api.getConceptLinkList = jest.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});

		api.putConceptValidList = jest.fn().mockImplementation(() => {
			return Promise.resolve();
		});

		render(
			<Provider store={store}>
				<MemoryRouter>
					<ConceptVisualizationContainer />
				</MemoryRouter>
			</Provider>
		);

		const publish = await screen.findByText('Publish');
		fireEvent.click(publish);

		expect(api.putConceptValidList).toHaveBeenCalled();
	});

	it('should delete the component', async () => {
		api.getConceptGeneral = jest.fn().mockImplementation(() => {
			return Promise.resolve({
				conceptVersion: 1,
			});
		});
		api.getNoteVersionList = jest.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});
		api.getConceptLinkList = jest.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});

		api.deleteConcept = jest.fn().mockImplementation(() => {
			return Promise.resolve();
		});

		render(
			<Provider store={store}>
				<MemoryRouter>
					<ConceptVisualizationContainer />
				</MemoryRouter>
			</Provider>
		);

		const deleteButton = await screen.findByText('Delete');
		fireEvent.click(deleteButton);

		const yesButton = await screen.findByText('Yes');
		fireEvent.click(yesButton);

		expect(api.deleteConcept).toHaveBeenCalled();
	});
});
