import { render } from '@testing-library/react';
import ConceptGeneral from './general';
import { empty } from '../utils/general';

vi.mock('@components/creators-input', () => ({ CreatorsInput: () => <></> }));
vi.mock('@components/dissemination-status/disseminationStatus', () => ({
	DisseminationStatusInput: () => <></>,
}));

describe('concept-edition-creation-general', () => {
	it('renders without crashing', () => {
		render(
			<ConceptGeneral
				general={empty()}
				stampList={[]}
				handleChange={vi.fn()}
			/>,
		);
	});
});
