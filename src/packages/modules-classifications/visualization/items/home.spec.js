import ClassificationItems from './home';
import { renderWithAppContext } from '../../../tests-utils/render';

describe('classification-items-home', () => {
	it('renders without crashing', () => {
		renderWithAppContext(
			<ClassificationItems
				items={[]}
				classificationId="id"
				secondLang={false}
			/>
		);
	});
});
