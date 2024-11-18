import { screen } from '@testing-library/react';
import OperationsObjectHome from './index';

import { Provider } from 'react-redux';
import configureStore from '../../../redux/configure-store';
import { renderWithRouter } from '../../../tests-utils/render';
import { MasculineButton } from '@components/new-button';

const createStore = (roles: string[] = []) => {
	return configureStore({
		users: { results: { stamp: 'stamp' } },
		app: { auth: { user: { roles } } },
	});
};
describe('Operation Home', () => {
	it('should display the PageTitle component', () => {
		const store = createStore();

		const { container } = renderWithRouter(
			<Provider store={store}>
				<OperationsObjectHome
					title="title"
					items={[]}
					createButton={<MasculineButton action=""></MasculineButton>}
					searchURL=""
					childPath=""
					roles={[]}
				/>
			</Provider>,
		);

		expect(container.querySelectorAll('h1')).toHaveLength(1);
	});
	it('should display the SearchableList component', () => {
		const store = createStore();

		const { container } = renderWithRouter(
			<Provider store={store}>
				<OperationsObjectHome
					title="title"
					items={[]}
					createButton={<MasculineButton action=""></MasculineButton>}
					searchURL=""
					childPath=""
					roles={[]}
				/>
			</Provider>,
		);
		expect(container.querySelectorAll('.list-group')).toHaveLength(1);
	});

	it('should always display the Tree button', async () => {
		const store = createStore();

		renderWithRouter(
			<Provider store={store}>
				<OperationsObjectHome
					title="title"
					items={[]}
					createButton={<MasculineButton action=""></MasculineButton>}
					searchURL=""
					childPath=""
					roles={[]}
				/>
			</Provider>,
		);
		await screen.findByText('View tree');
	});
	it('should display the New button if the user has the right role', async () => {
		const store = createStore(['role']);

		renderWithRouter(
			<Provider store={store}>
				<OperationsObjectHome
					title="title"
					items={[]}
					createButton={<MasculineButton action=""></MasculineButton>}
					searchURL=""
					childPath=""
					roles={['role']}
				/>
			</Provider>,
		);
		await screen.findByText('New');
	});
	it('should not display the New button if the user does not have the right role', () => {
		const store = createStore(['role']);

		const { queryByText } = renderWithRouter(
			<Provider store={store}>
				<OperationsObjectHome
					title="title"
					items={[]}
					createButton={<MasculineButton action=""></MasculineButton>}
					searchURL=""
					childPath=""
					roles={['role1']}
				/>
			</Provider>,
		);
		expect(queryByText('New')).toBeNull();
	});
});
