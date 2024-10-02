import Home from './home';
import * as associationUtils from '../../../modules-classifications/utils/correspondence/association';
import { renderWithAppContext } from '../../../tests-utils/render';
import { locales } from '../../../tests-utils/default-values';

describe('association-home', () => {
	it('renders without crashing', () => {
		renderWithAppContext(
			<Home
				association={associationUtils.empty()}
				secondLang={false}
				langs={locales}
			/>,
		);
	});
});
