import ViewContainer from './view-container';
import { Provider } from 'react-redux';
import configureStore from '../../../../new-architecture/redux/configure-store';
import { renderWithRouter } from '../../../../new-architecture/tests-utils/render';

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
		renderWithRouter(
			<Provider store={store}>
				<ViewContainer />
			</Provider>
		);
	});
});
