import ClassificationItems from './home';
import { Provider } from 'react-redux';
import configureStore from '../../../redux/configure-store';
import { renderWithRouter } from '../../../tests-utils/render';

const store = configureStore({
	app: {
		secondLang: true,
	},
});

describe('classification-items-home', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Provider store={store}>
				<ClassificationItems
					items={[]}
					classificationId="id"
					secondLang={false}
				/>
			</Provider>
		);
	});
});
