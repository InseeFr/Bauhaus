import { render } from '@testing-library/react';
import ConceptGeneral from './general';
import { empty } from '../utils/general';
import { locales } from '../../tests-utils/default-values';

jest.mock('../../components');

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
