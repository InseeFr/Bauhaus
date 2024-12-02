import { Provider } from 'react-redux';

import configureStore from '../../redux/configure-store';
import { renderWithAppContext } from '../../tests-utils/render';
import Home from './home';

const store = configureStore({
	users: { results: { stamp: 'stamp' } },
	app: { auth: { type: '', user: { roles: [] } } },
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
		renderWithAppContext(
			<Provider store={store}>
				<Home
					classification={classification}
					classificationId="classificationId"
					secondLang={false}
					publish={vi.fn()}
					serverSideError=""
				/>
			</Provider>,
		);
	});
});
