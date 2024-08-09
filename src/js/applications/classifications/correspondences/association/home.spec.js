import Home from './home';
import * as associationUtils from '../../../../applications/classifications/utils/correspondence/association';

import { Provider } from 'react-redux';
import configureStore from '../../../../new-architecture/redux/configure-store';
import { renderWithRouter } from '../../../../new-architecture/tests-utils/render';
import { locales } from '../../../../new-architecture/tests-utils/default-values';

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
