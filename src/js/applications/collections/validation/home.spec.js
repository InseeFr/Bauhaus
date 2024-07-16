import CollectionValidation from './home';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

describe('collection-validation', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<CollectionValidation
				collections={[]}
				permission={{ authType: '', roles: [''] }}
				handleValidateCollectionList={jest.fn()}
			/>
		);
	});
});
