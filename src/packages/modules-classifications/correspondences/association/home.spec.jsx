import { locales } from '../../../tests-utils/default-values';
import { renderWithAppContext } from '../../../tests-utils/render';
import * as associationUtils from '../../utils/correspondence/association';
import Home from './home';

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
