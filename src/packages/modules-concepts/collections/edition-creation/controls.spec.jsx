import Controls from './controls';
import { renderWithRouter } from '../../../tests-utils/render';

describe('collection-edition-creation-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Controls
				handleSave={vi.fn()}
				redirectCancel={() => 'collections'}
				errors={{ errorMessage: [], fields: {} }}
			/>
		);
	});
});
