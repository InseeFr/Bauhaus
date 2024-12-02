import { renderWithRouter } from '../../../tests-utils/render';
import Controls from './controls';

describe('collection-edition-creation-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Controls
				handleSave={vi.fn()}
				redirectCancel={() => 'collections'}
				errors={{ errorMessage: [], fields: {} }}
			/>,
		);
	});
});
