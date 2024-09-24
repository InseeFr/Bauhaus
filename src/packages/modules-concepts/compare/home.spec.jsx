import Compare from './home';
import { renderWithAppContext } from '../../tests-utils/render';
import { locales } from '../../tests-utils/default-values';

describe('concepts-compare', () => {
	it('renders without crashing', () => {
		renderWithAppContext(
			<Compare
				id="id"
				conceptGeneral={{ conceptVersion: '2' }}
				notes={{ 2: {}, 1: {} }}
				secondLang={false}
				langs={locales}
			/>
		);
	});
});
