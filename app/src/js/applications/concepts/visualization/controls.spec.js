import { render } from '@testing-library/react';
import ConceptVisualizationControls from './controls';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../../remote-api/concepts-api');

describe('concept-visualization-controls', () => {
	it('renders without crashing', () => {
		render(
			<ConceptVisualizationControls
				id="id"
				creator="creator"
				isValidated={false}
				conceptVersion="1"
				handleValidation={jest.fn()}
				permission={{ authType: '', roles: [''] }}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
