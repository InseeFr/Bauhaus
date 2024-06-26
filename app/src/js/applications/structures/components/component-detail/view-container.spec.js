import { render } from '@testing-library/react';
import ViewContainer from './view-container';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

const mockStore = configureStore([]);
const store = mockStore({
	app: {
		secondLang: true,
	},
});

jest.mock('./view', () => ({
	ComponentDetailView: () => <></>,
}));
describe('ViewContainer', () => {
	it('should display altLabel label', () => {
		render(
			<MemoryRouter>
				<Provider store={store}>
					<ViewContainer />
				</Provider>
			</MemoryRouter>
		);
	});
});
