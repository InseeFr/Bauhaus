import { render } from '@testing-library/react';
import General from './general';
import { locales } from '../../../tests-utils/default-values';

const general = {};

describe('classification-series-general', () => {
	it('renders without crashing', () => {
		render(<General general={general} secondLang={false} langs={locales} />);
	});
});
