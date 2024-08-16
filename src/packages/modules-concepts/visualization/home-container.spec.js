import { fireEvent, screen } from '@testing-library/react';
import ConceptVisualizationContainer from './home-container';
import { Provider } from 'react-redux';
import { ConceptsApi } from '../../sdk';
import * as R from '../../auth/roles';
import configureStore from '../../redux/configure-store';
import { renderWithRouter } from '../../tests-utils/render';
import { locales } from '../../tests-utils/default-values';

jest.mock('../../sdk');

const store = configureStore({
	app: {
		auth: {
			type: 'type',
			user: {
				roles: [R.ADMIN],
				stamp: 'stamp',
			},
		},
		...locales,
	},
});

describe('ConceptVisualizationContainer', () => {
	it('should display the component', async () => {
		ConceptsApi.getConceptGeneral = jest.fn().mockImplementation(() => {
			return Promise.resolve({
				conceptVersion: 1,
			});
		});
		ConceptsApi.getNoteVersionList = jest.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});
		ConceptsApi.getConceptLinkList = jest.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});
		renderWithRouter(
			<Provider store={store}>
				<ConceptVisualizationContainer />
			</Provider>
		);

		expect(ConceptsApi.getConceptGeneral).toHaveBeenCalled();
	});

	it('should publish the component', async () => {
		ConceptsApi.getConceptGeneral = jest.fn().mockImplementation(() => {
			return Promise.resolve({
				conceptVersion: 1,
			});
		});
		ConceptsApi.getNoteVersionList = jest.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});
		ConceptsApi.getConceptLinkList = jest.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});

		ConceptsApi.putConceptValidList = jest.fn().mockImplementation(() => {
			return Promise.resolve();
		});

		renderWithRouter(
			<Provider store={store}>
				<ConceptVisualizationContainer />
			</Provider>
		);

		const publish = await screen.findByText('Publish');
		fireEvent.click(publish);

		expect(ConceptsApi.putConceptValidList).toHaveBeenCalled();
	});

	it('should delete the component', async () => {
		ConceptsApi.getConceptGeneral = jest.fn().mockImplementation(() => {
			return Promise.resolve({
				conceptVersion: 1,
			});
		});
		ConceptsApi.getNoteVersionList = jest.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});
		ConceptsApi.getConceptLinkList = jest.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});

		ConceptsApi.deleteConcept = jest.fn().mockImplementation(() => {
			return Promise.resolve();
		});

		renderWithRouter(
			<Provider store={store}>
				<ConceptVisualizationContainer />
			</Provider>
		);

		const deleteButton = await screen.findByText('Delete');
		fireEvent.click(deleteButton);

		const yesButton = await screen.findByText('Yes');
		fireEvent.click(yesButton);

		expect(ConceptsApi.deleteConcept).toHaveBeenCalled();
	});
});
