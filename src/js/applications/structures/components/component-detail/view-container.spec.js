import { render } from '@testing-library/react';
import ViewContainer from './view-container';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from '../../../../store/configure-store';

const store = configureStore({
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
