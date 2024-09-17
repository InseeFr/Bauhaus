import CollectionValidation from './home';
import { renderWithRouter } from '../../../tests-utils/render';

describe('collection-validation', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<CollectionValidation
				collections={[]}
				permission={{ authType: '', roles: [''] }}
				handleValidateCollectionList={vi.fn()}
			/>
		);
	});
});
