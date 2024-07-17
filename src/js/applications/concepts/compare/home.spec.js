import Compare from './home';
import { Provider } from 'react-redux';
import configureStore from '../../../store/configure-store';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

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
					langs={{ lg1: 'fr', lg2: 'en' }}
				/>
			</Provider>
		);
	});
});
