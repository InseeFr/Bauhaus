import Home from './home';

import { Provider } from 'react-redux';
import configureStore from '../../../new-architecture/redux/configure-store';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';
const store = configureStore({
	app: {
		secondLang: true,
	},
});

const level = {
	general: { prefLabelLg1: 'Label', classificationId: 'id' },
	members: [{ id: '1', label: 'Member 1' }],
};

const langs = { lg1: 'fr', lg2: 'en' };

describe('classification-level-home', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Provider store={store}>
				<Home level={level} langs={langs} secondLang={true} />
			</Provider>
		);
	});
});
