import Home from './home';
import { renderWithAppContext } from '../../tests-utils/render';
import { locales } from '../../tests-utils/default-values';

const level = {
	general: { prefLabelLg1: 'Label', classificationId: 'id' },
	members: [{ id: '1', label: 'Member 1' }],
};

describe('classification-level-home', () => {
	it('renders without crashing', () => {
		renderWithAppContext(
			<Home level={level} langs={locales} secondLang={true} />
		);
	});
});
