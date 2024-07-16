import { render, screen } from '@testing-library/react';
import OperationsObjectHome from './index';
import { MemoryRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { MasculineButton } from '../../../../new-architecture/components/new-button';
import configureStore from '../../../../store/configure-store';

const createStore = (roles = []) => {
	return configureStore({
		users: { results: { stamp: 'stamp' } },
		app: { auth: { user: { roles } } },
	});
};
describe('Operation Home', () => {
	it('should display the PageTitle component', () => {
		const store = createStore();

		const { container } = render(
			<Provider store={store}>
				<OperationsObjectHome
					items={[]}
					createButton={<MasculineButton action={''}></MasculineButton>}
					searchURL=""
					childPath=""
					roles={[]}
				/>
			</Provider>,
			{ wrapper: MemoryRouter }
		);

		expect(container.querySelectorAll('h1')).toHaveLength(1);
	});
	it('should display the SearchableList component', () => {
		const store = createStore();

		const { container } = render(
			<Provider store={store}>
				<OperationsObjectHome
					items={[]}
					createButton={<MasculineButton action={''}></MasculineButton>}
					searchURL=""
					childPath=""
					roles={[]}
				/>
			</Provider>,
			{ wrapper: MemoryRouter }
		);
		expect(container.querySelectorAll('.list-group')).toHaveLength(1);
	});

	it('should always display the Tree button', async () => {
		const store = createStore();

		render(
			<Provider store={store}>
				<OperationsObjectHome
					items={[]}
					createButton={<MasculineButton action={''}></MasculineButton>}
					searchURL=""
					childPath=""
					roles={[]}
				/>
			</Provider>,
			{ wrapper: MemoryRouter }
		);
		await screen.findByText('View tree');
	});
	it('should display the New button if the user has the right role', async () => {
		const store = createStore(['role']);

		render(
			<Provider store={store}>
				<OperationsObjectHome
					items={[]}
					createButton={<MasculineButton action={''}></MasculineButton>}
					searchURL=""
					childPath=""
					roles={['role']}
				/>
			</Provider>,
			{ wrapper: MemoryRouter }
		);
		await screen.findByText('New');
	});
	it('should not display the New button if the user does not have the right role', () => {
		const store = createStore(['role']);

		const { queryByText } = render(
			<Provider store={store}>
				<OperationsObjectHome
					items={[]}
					createButton={<MasculineButton action={''}></MasculineButton>}
					searchURL=""
					childPath=""
					roles={['role1']}
				/>
			</Provider>,
			{ wrapper: MemoryRouter }
		);
		expect(queryByText('New')).toBeNull();
	});
});
