import React from 'react';
import { render } from '@testing-library/react';
import OutlineBlock from 'js/applications/operations/msd/outline/outline-block';
import { MemoryRouter } from 'react-router-dom';

jest.mock('js/applications/operations/msd/utils');

const childrenOpened = {
	'1': { idMas: '1', children: {} },
};
describe('OutlineBlock', () => {
	it('should display the informations', () => {
		const { container } = render(
			<MemoryRouter>
				<OutlineBlock parent="1" children={childrenOpened} />
			</MemoryRouter>
		);
		const links = container.querySelectorAll('a');
		expect(links).toHaveLength(1);
		expect(links[0].href).toContain('/operations/help/1#1');
	});
	it('should not use anchor', () => {
		const { container } = render(
			<MemoryRouter>
				<OutlineBlock disableSectionAnchor children={childrenOpened} />
			</MemoryRouter>
		);

		const links = container.querySelectorAll('a');
		expect(links).toHaveLength(1);
		expect(links[0].href).toContain('/operations/help/#1');
	});
});
