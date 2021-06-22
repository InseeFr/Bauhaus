import React from 'react';
import { render } from '@testing-library/react';
import Compare from './home';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({
	app: {
		secondLang: true,
	},
});

describe('concepts-compare', () => {
	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<Compare
					classificationId="classificationId"
					itemId="itemId"
					general={{
						prefLabelLg1: 'prefLabelLg1',
						isValidated: 'true',
						conceptVersion: '2',
					}}
					notes={{ '1': {}, '2': {} }}
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
