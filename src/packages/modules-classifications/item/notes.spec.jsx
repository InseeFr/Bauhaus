import { render } from '@testing-library/react';

import { locales } from '../../tests-utils/default-values';
import ItemNotesVisualization from './notes';

describe('classification-visualization-notes', () => {
	it('renders without crashing', () => {
		render(
			<ItemNotesVisualization notes={{}} langs={locales} secondLang={true} />,
		);
	});
});
