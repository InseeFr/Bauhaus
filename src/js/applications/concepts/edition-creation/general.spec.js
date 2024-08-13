import { render } from '@testing-library/react';
import ConceptGeneral from './general';
import { empty } from '../../../new-architecture/modules-concepts/utils/general';
import { locales } from '../../../new-architecture/tests-utils/default-values';

jest.mock('../../../new-architecture/components');

describe('concept-edition-creation-general', () => {
	it('renders without crashing', () => {
		render(
			<ConceptGeneral
				general={empty()}
				stampList={[]}
				handleChange={jest.fn()}
				langs={locales}
			/>
		);
	});
});
