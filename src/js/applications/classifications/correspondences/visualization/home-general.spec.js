import { render } from '@testing-library/react';
import HomeGeneral from './home-general';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../../../../store/configure-store';

const store = configureStore({
	app: {
		secondLang: true,
	},
});

const correspondence = {
	id: '1',
	labelLg1: 'Correspondence 1',
	idFirstClass: 'class1',
	firstClassLabelLg1: 'Classification 1',
	idSecondClass: 'class2',
	secondClassLabelLg1: 'Classification 2',
};

describe('correspondence-home-general', () => {
	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<HomeGeneral
					correspondence={correspondence}
					secondLang={true}
					langs={{ lg1: 'fr', lg2: 'en' }}
				/>
			</Provider>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
