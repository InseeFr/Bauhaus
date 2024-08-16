import { render } from '@testing-library/react';
import Controls from './controls';

describe('classification-family-visualization-controls', () => {
	it('renders without crashing', () => {
		render(<Controls />);
	});
});
