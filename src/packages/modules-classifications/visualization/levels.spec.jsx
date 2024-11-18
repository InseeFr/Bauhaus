import { renderWithRouter } from '../../tests-utils/render';
import Levels from './levels';

const levels = [{ id: '1', label: 'Member 1' }];

describe('classification-series-levels', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Levels
				levels={levels}
				classificationId="classification"
				secondLang={true}
			/>,
		);
	});
});
