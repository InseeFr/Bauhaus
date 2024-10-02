import ClassificationTree from './home';
import { renderWithAppContext } from '../../../tests-utils/render';

describe('classification-tree-home', () => {
	it('renders without crashing', () => {
		renderWithAppContext(
			<ClassificationTree data={[]} prefLabel="prefLabel" secondLang={true} />,
		);
	});
});
