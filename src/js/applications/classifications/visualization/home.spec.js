import Home from './home';
import { Provider } from 'react-redux';
import configureStore from '../../../new-architecture/redux/configure-store';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';
import { locales } from '../../../new-architecture/tests-utils/default-values';

const store = configureStore({
	users: { results: { stamp: 'stamp' } },
	app: { secondLang: true, auth: { type: '', user: { roles: [] } } },
});

const classification = {
	general: { prefLabelLg1: 'Label' },
	levels: [{ id: '1', label: 'Member 1' }],
	notes: {
		scopeNoteLg1: 'scopeNoteLg1',
		scopeNoteLg2: 'scopeNoteLg2',
		changeNoteLg1: 'changeNoteLg1',
		changeNoteLg2: 'changeNoteLg2',
	},
};

describe('classification-home', () => {
	it('renders without crashing', async () => {
		renderWithRouter(
			<Provider store={store}>
				<Home
					classification={classification}
					classificationId={'classificationId'}
					langs={locales}
					secondLang={false}
					publish={jest.fn()}
					serverSideError={''}
				/>
			</Provider>
		);
	});
});
