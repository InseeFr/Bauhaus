import ClassificationTree from './home';
import { Provider } from 'react-redux';
import configureStore from '../../../../store/configure-store';
import { renderWithRouter } from '../../../../new-architecture/tests-utils/render';

const store = configureStore({
	app: { secondLang: true },
});

describe('classification-tree-home', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Provider store={store}>
				<ClassificationTree data={[]} prefLabel="prefLabel" secondLang={true} />
			</Provider>
		);
	});
});
