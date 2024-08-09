import HomeGeneral from './home-general';
import { Provider } from 'react-redux';
import configureStore from '../../../../new-architecture/redux/configure-store';
import { renderWithRouter } from '../../../../new-architecture/tests-utils/render';
import { locales } from '../../../../new-architecture/tests-utils/default-values';

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
		renderWithRouter(
			<Provider store={store}>
				<HomeGeneral
					correspondence={correspondence}
					secondLang={true}
					langs={locales}
				/>
			</Provider>
		);
	});
});
