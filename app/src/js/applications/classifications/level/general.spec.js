import { render } from '@testing-library/react';
import General from './general';

const general = {};
const langs = { lg1: 'fr', lg2: 'en' };

describe('classification-level-general', () => {
	it('renders without crashing', () => {
		render(<General general={general} secondLang={false} langs={langs} />);
	});
});
