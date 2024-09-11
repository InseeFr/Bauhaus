import { empty } from '../../utils/general';
import Controls from './';
import { renderWithRouter } from '../../../tests-utils/render';

describe('concept-edition-creation-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Controls
				oldGeneral={empty()}
				general={empty()}
				notes={{}}
				conceptsWithLinks={[]}
				handleSave={vi.fn()}
				redirectCancel={vi.fn()}
			/>
		);
	});
});
