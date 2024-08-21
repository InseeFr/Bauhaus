import Controls from './controls';
import { empty } from '../../../modules-concepts/collections/utils/general';
import { renderWithRouter } from '../../../tests-utils/render';

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
