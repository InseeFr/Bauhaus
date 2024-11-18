import { render } from '@testing-library/react';

import { Tree } from './';

describe('tree-dnd', () => {
	it('renders without crashing', () => {
		render(<Tree treeData={[]} linkPath={(l) => l} />);
	});
});
