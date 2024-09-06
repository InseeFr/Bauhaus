import Compare from './home';
import { renderWithAppContext } from '../../../tests-utils/render';
import { locales } from '../../../tests-utils/default-values';

describe('concepts-compare', () => {
	it('renders without crashing', () => {
		renderWithAppContext(
			<Compare
				classificationId="classificationId"
				itemId="itemId"
				general={{
					prefLabelLg1: 'prefLabelLg1',
					isValidated: 'true',
					conceptVersion: '2',
				}}
				notes={{ 1: {}, 2: {} }}
				secondLang={false}
				langs={locales}
			/>
		);
	});
});
