import Home from './home';

import { Provider } from 'react-redux';
import configureStore from '../../../../store/configure-store';
import { renderWithRouter } from '../../../../new-architecture/tests-utils/render';

const store = configureStore({
	app: {
		secondLang: true,
	},
});

const series = {
	general: { prefLabelLg1: 'Label' },
	members: [{ id: '1', label: 'Member 1' }],
	notes: {
		scopeNoteLg1: 'scopeNoteLg1',
		scopeNoteLg2: 'scopeNoteLg2',
	},
};

const langs = { lg1: 'fr', lg2: 'en' };

describe('classification-series-home', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Provider store={store}>
				<Home series={series} langs={langs} secondLang={true} />
			</Provider>
		);
	});
});
