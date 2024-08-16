import Compare from './home';
import { Provider } from 'react-redux';
import configureStore from '../../redux/configure-store';
import { renderWithRouter } from '../../tests-utils/render';
import { locales } from '../../tests-utils/default-values';

const store = configureStore({
	app: {
		secondLang: true,
	},
});

describe('concepts-compare', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Provider store={store}>
				<Compare
					id={'id'}
					conceptGeneral={{ conceptVersion: '2' }}
					notes={{ 2: {}, 1: {} }}
					secondLang={false}
					langs={locales}
				/>
			</Provider>
		);
	});
});
