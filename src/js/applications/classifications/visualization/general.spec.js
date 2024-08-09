import { render } from '@testing-library/react';
import General from './general';
import { locales } from '../../../new-architecture/tests-utils/default-values';

const general = {};

describe('classification-general', () => {
	it('renders without crashing', () => {
		render(<General general={general} secondLang={false} langs={locales} />);
	});
});
