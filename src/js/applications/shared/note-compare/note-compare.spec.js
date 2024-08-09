import { render } from '@testing-library/react';
import CompareNotes from './';
import { locales } from '../../../new-architecture/tests-utils/default-values';

const builder = () => [{ lg1: 'noteLg1', lg2: 'noteLg2', title: 'title' }];

describe('visualization-compare-notes', () => {
	it('renders without crashing', () => {
		render(
			<CompareNotes
				notes={{ 1: {}, 2: {} }}
				secondLang={false}
				langs={locales}
				version={2}
				buildNotes={builder}
			/>
		);
	});
});
