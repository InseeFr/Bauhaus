import { render, screen } from '@testing-library/react';

import { Structure } from '../../../model/structures/Structure';
import { GlobalInformationsPanel } from './global-informations-panel';

describe('GlobalInformationsPanel', () => {
	const mockStructure: Structure = {
		identifiant: '12345',
		created: '2022-01-01',
		modified: '2022-02-01',
		creator: 'STAMP CREATOR',
		contributor: ['STAMP CONTRIBUTOR'],
		disseminationStatus:
			'http:/id.insee.fr/codes/base/statutDiffusion/PublicGenerique',
	} as Structure;

	it('should render the structure information correctly', () => {
		render(<GlobalInformationsPanel structure={mockStructure} />);

		screen.getByText(/12345/);
		screen.getByText(/Creation date : 01\/01\/2022/);
		screen.getByText(/Modification date : 02\/01\/2022/);
		screen.getByText(/Publication status : Temporary, never published/);
		screen.getByText(/Creator : STAMP CREATOR/);
		screen.getByText(/Contributor :/);
		screen.getByText(/STAMP CONTRIBUTOR/);
		screen.getByText(/Dissemination status : Public generic/);
	});
});
