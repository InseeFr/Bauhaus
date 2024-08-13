import { render } from '@testing-library/react';
import ConceptGeneralVisualization from './general';
import { empty } from '../../../new-architecture/modules-concepts/utils/general';
import { locales } from '../../../new-architecture/tests-utils/default-values';

describe('concept-visualization-general', () => {
	it('renders without crashing', () => {
		render(
			<ConceptGeneralVisualization
				attr={empty()}
				secondLang={false}
				langs={locales}
			/>
		);
	});
});
