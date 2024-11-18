import { locales } from '../../../tests-utils/default-values';
import { renderWithAppContext } from '../../../tests-utils/render';
import HomeGeneral from './home-general';

const correspondence = {
	id: '1',
	labelLg1: 'Correspondence 1',
	idFirstClass: 'class1',
	firstClassLabelLg1: 'Classification 1',
	idSecondClass: 'class2',
	secondClassLabelLg1: 'Classification 2',
};

describe('correspondence-home-general', () => {
	it('renders without crashing', () => {
		renderWithAppContext(
			<HomeGeneral
				correspondence={correspondence}
				secondLang={true}
				langs={locales}
			/>,
		);
	});
});
