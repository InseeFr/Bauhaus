import { empty } from '../../../../new-architecture/modules-concepts/utils/general';
import Controls from './';
import { renderWithRouter } from '../../../../new-architecture/tests-utils/render';

describe('concept-edition-creation-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Controls
				oldGeneral={empty()}
				general={empty()}
				notes={{}}
				conceptsWithLinks={[]}
				handleSave={jest.fn()}
				redirectCancel={jest.fn()}
			/>
		);
	});
});
