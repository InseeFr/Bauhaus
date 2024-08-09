import Home from './home';

import { Provider } from 'react-redux';
import configureStore from '../../../new-architecture/redux/configure-store';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';
import { locales } from '../../../new-architecture/tests-utils/default-values';
const store = configureStore({
	app: {
		secondLang: true,
	},
});

const level = {
	general: { prefLabelLg1: 'Label', classificationId: 'id' },
	members: [{ id: '1', label: 'Member 1' }],
};

describe('classification-level-home', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Provider store={store}>
				<Home level={level} langs={locales} secondLang={true} />
			</Provider>
		);
	});
});
