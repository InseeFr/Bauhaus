import { renderWithRouter } from '../../../tests-utils/render';
import CollectionValidation from './home';

describe('collection-validation', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<CollectionValidation
				collections={[]}
				permission={{ authType: '', roles: [''] }}
				handleValidateCollectionList={vi.fn()}
			/>,
		);
	});
});
