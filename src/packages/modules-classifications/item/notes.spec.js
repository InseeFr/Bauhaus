import { render } from '@testing-library/react';
import ItemNotesVisualization from './notes';
import { locales } from '../../tests-utils/default-values';

describe('classification-visualization-notes', () => {
	it('renders without crashing', () => {
		render(
			<ItemNotesVisualization notes={{}} langs={locales} secondLang={true} />
		);
	});
});
