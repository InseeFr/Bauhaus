import Home from './home';
import * as associationUtils from '../../../modules-classifications/utils/correspondence/association';

import { Provider } from 'react-redux';
import configureStore from '../../../redux/configure-store';
import { renderWithRouter } from '../../../tests-utils/render';
import { locales } from '../../../tests-utils/default-values';

const store = configureStore({
	app: {
		secondLang: true,
	},
});

describe('association-home', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Provider store={store}>
				<Home
					association={associationUtils.empty()}
					secondLang={false}
					langs={locales}
				/>
			</Provider>
		);
	});
});
