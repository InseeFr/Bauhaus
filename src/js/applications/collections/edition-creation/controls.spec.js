import Controls from './controls';
import { empty } from '../../../utils/collections/general';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

describe('collection-edition-creation-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Controls
				general={empty()}
				collectionList={[]}
				handleSave={jest.fn()}
				redirectCancel={() => 'collections'}
			/>
		);
	});
});
