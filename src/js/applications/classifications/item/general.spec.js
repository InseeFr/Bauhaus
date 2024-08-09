import { render } from '@testing-library/react';
import General from './general';
import { locales } from '../../../new-architecture/tests-utils/default-values';

const general = {};

describe('classification-level-general', () => {
	it('renders without crashing', () => {
		render(
			<General
				general={general}
				classificationId="id"
				itemId="id"
				secondLang={false}
				langs={locales}
			/>
		);
	});
});
