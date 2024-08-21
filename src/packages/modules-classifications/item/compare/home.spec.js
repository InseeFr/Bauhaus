import Compare from './home';
import { Provider } from 'react-redux';
import configureStore from '../../../redux/configure-store';
import { renderWithRouter } from '../../../tests-utils/render';
import { locales } from '../../../tests-utils/default-values';

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
					classificationId="classificationId"
					itemId="itemId"
					general={{
						prefLabelLg1: 'prefLabelLg1',
						isValidated: 'true',
						conceptVersion: '2',
					}}
					notes={{ 1: {}, 2: {} }}
					secondLang={false}
					langs={locales}
				/>
			</Provider>
		);
	});
});
