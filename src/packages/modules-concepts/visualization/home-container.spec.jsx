import { fireEvent, screen } from '@testing-library/react';
import ConceptVisualizationContainer from './home-container';
import { Provider } from 'react-redux';
import { ConceptsApi } from '../../sdk';
import * as R from '../../auth/roles';
import configureStore from '../../redux/configure-store';
import { renderWithAppContext } from '../../tests-utils/render';

vi.mock('../../sdk');

const store = configureStore({
	app: {
		auth: {
			type: 'type',
			user: {
				roles: [R.ADMIN],
				stamp: 'stamp',
			},
		},
	},
});

describe('ConceptVisualizationContainer', () => {
	it('should display the component', async () => {
		ConceptsApi.getConceptGeneral = vi.fn().mockImplementation(() => {
			return Promise.resolve({
				conceptVersion: 1,
			});
		});
		ConceptsApi.getNoteVersionList = vi.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});
		ConceptsApi.getConceptLinkList = vi.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});
		renderWithAppContext(
			<Provider store={store}>
				<ConceptVisualizationContainer />
			</Provider>
		);

		expect(ConceptsApi.getConceptGeneral).toHaveBeenCalled();
	});

	it('should publish the component', async () => {
		ConceptsApi.getConceptGeneral = vi.fn().mockImplementation(() => {
			return Promise.resolve({
				conceptVersion: 1,
			});
		});
		ConceptsApi.getNoteVersionList = vi.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});
		ConceptsApi.getConceptLinkList = vi.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});

		ConceptsApi.putConceptValidList = vi.fn().mockImplementation(() => {
			return Promise.resolve();
		});

		renderWithAppContext(
			<Provider store={store}>
				<ConceptVisualizationContainer />
			</Provider>
		);

		const publish = await screen.findByText('Publish');
		fireEvent.click(publish);

		expect(ConceptsApi.putConceptValidList).toHaveBeenCalled();
	});

	it('should delete the component', async () => {
		ConceptsApi.getConceptGeneral = vi.fn().mockImplementation(() => {
			return Promise.resolve({
				conceptVersion: 1,
			});
		});
		ConceptsApi.getNoteVersionList = vi.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});
		ConceptsApi.getConceptLinkList = vi.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});

		ConceptsApi.deleteConcept = vi.fn().mockImplementation(() => {
			return Promise.resolve();
		});

		renderWithAppContext(
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