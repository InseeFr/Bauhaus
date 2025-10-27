import { renderWithRouter } from '../../../tests/render';
import CollectionValidation from './home';

describe('collection-validation', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<CollectionValidation
				collections={[]}
				permission={{ authType: '' }}
				handleValidateCollectionList={vi.fn()}
			/>,
		);
	});
});
