import { renderWithAppContext } from '../../../tests/render';
import ClassificationTree from './home';

describe('classification-tree-home', () => {
	it('renders without crashing', () => {
		renderWithAppContext(
			<ClassificationTree data={[]} prefLabel="prefLabel" secondLang={true} />,
		);
	});
});
