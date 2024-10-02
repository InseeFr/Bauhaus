import Narrowers from './narrowers';
import { renderWithRouter } from '../../tests-utils/render';

const narrowers = [{ id: '1', label: 'Narrower 1' }];

describe('classification-item-narrowers', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Narrowers
				narrowers={narrowers}
				classificationId="id"
				secondLang={true}
			/>,
		);
	});
});
