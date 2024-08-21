import Home from './home';
import { Provider } from 'react-redux';
import configureStore from '../../../redux/configure-store';
import { renderWithRouter } from '../../../tests-utils/render';

const store = configureStore({
	app: {
		secondLang: true,
	},
});

const family = {
	general: { prefLabelLg1: 'Label' },
	members: [{ id: '1', label: 'Member 1' }],
};

describe('classification-family-home', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Provider store={store}>
				<Home family={family} secondLang={true} />
			</Provider>
		);
	});
});
