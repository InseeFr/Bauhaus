import { render } from '@testing-library/react';
import Home from './home';
import * as associationUtils from '../../../../applications/classifications/utils/correspondence/association';
import { MemoryRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({
	app: {
		secondLang: true,
	},
});

describe('association-home', () => {
	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<Home
					association={associationUtils.empty()}
					secondLang={false}
					langs={{ lg1: 'fr', lg2: 'en' }}
				/>
			</Provider>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
