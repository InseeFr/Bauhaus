import React from 'react';
import { render } from '@testing-library/react';
import { DatasetEdit } from './edit';
import { useDataset } from '../../datasets';
import { MemoryRouter, Route } from 'react-router-dom';
import configureStore from '../../../redux/configure-store';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

jest.mock('../../datasets', () => ({
	useDataset: jest.fn(),
}));

const store = configureStore({
	app: { secondLang: true, auth: { type: '', user: { roles: [] } } },
});

describe('DatasetEdit Component', () => {
	const id = '123';

	it('should display Loading component when editingDataset has no id and isEditing is true', () => {
		useDataset.mockReturnValue({
			data: {},
			status: 'success',
		});

		const { getByText } = render(
			<QueryClientProvider client={queryClient}>
				<Provider store={store}>
					<MemoryRouter initialEntries={[`/datasets/${id}`]}>
						<Route path="/datasets/:id">
							<DatasetEdit />
						</Route>
					</MemoryRouter>
				</Provider>
			</QueryClientProvider>
		);

		getByText(/loading/i);
	});
});
