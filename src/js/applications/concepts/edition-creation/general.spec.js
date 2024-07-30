import { render } from '@testing-library/react';
import ConceptGeneral from './general';
import { empty } from '../../../utils/concepts/general';

jest.mock('../../../new-architecture/components');

describe('concept-edition-creation-general', () => {
	it('renders without crashing', () => {
		render(
			<ConceptGeneral
				general={empty()}
				stampList={[]}
				handleChange={jest.fn()}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
