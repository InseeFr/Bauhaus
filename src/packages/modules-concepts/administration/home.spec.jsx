import Administration from './home';
import { renderWithRouter } from '../../tests-utils/render';

describe('administration', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Administration permission={{ authType: '', roles: [''] }} />
		);
	});
});
