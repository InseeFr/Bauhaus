import Home from './home';
import { Provider } from 'react-redux';
import configureStore from '../../../store/configure-store';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

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

const langs = { lg1: 'fr', lg2: 'en' };

describe('classification-home', () => {
	it('renders without crashing', async () => {
		renderWithRouter(
			<Provider store={store}>
				<Home
					classification={classification}
					classificationId={'classificationId'}
					langs={langs}
					secondLang={false}
					publish={jest.fn()}
					serverSideError={''}
				/>
			</Provider>
		);
	});
});
