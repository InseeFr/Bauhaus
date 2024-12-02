import { render } from '@testing-library/react';

import { locales } from '../../tests-utils/default-values';
import General from './general';

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
			/>,
		);
	});
});
