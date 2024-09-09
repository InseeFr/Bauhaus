import ViewContainer from './view-container';
import { renderWithAppContext } from '../../../tests-utils/render';
import configureStore from '../../../redux/configure-store';
import { Provider } from 'react-redux';

const store = configureStore({});
jest.mock('./view', () => ({
	ComponentDetailView: () => <></>,
}));
describe('ViewContainer', () => {
	it('should display altLabel label', () => {
		renderWithAppContext(
			<Provider store={store}>
				<ViewContainer />
			</Provider>
		);
	});
});
