import React from 'react';
import { shallow } from 'enzyme';
import ExportConcept from './home';

describe('concept-export', () => {
	it('renders without crashing', () => {
		shallow(
			<ExportConcept
				concepts={[]}
				handleExportConceptList={(a, b) => console.log('export')}
			/>
		);
	});
});
