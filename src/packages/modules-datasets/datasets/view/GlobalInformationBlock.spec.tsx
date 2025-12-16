import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import * as useCodesListHook from '@utils/hooks/codeslist';
import * as useOrganizationsHook from '@utils/hooks/organizations';

import { CodesList } from '../../../model/CodesList';
import { Dataset } from '../../../model/Dataset';
import * as useThemesHook from '../../hooks/useThemes';
import { GlobalInformationBlock } from './GlobalInformationBlock';

vi.mock('../../hooks/useThemes');
vi.mock('@utils/hooks/organizations');
vi.mock('@utils/hooks/codeslist');

vi.mock('./wasGeneratedByBlock', () => ({
	WasGeneratedByBlock: () => <div>Mocked WasGeneratedByBlock</div>,
}));

describe('GlobalInformationBlock', () => {
	const mockDataset = {
		catalogRecord: {
			created: '2021-01-01',
			updated: '2022-01-01',
		},
		issued: '2021-06-01',
		accessRights: 'public',
		accrualPeriodicity: 'annual',
		confidentialityStatus: 'open',
		creators: ['org1', 'org2'],
		publisher: 'org3',
		wasGeneratedIRIs: ['iri1', 'iri2'],
		themes: ['theme1', 'theme2'],
		keywords: {
			lg1: ['keyword1', 'keyword2'],
			lg2: ['keyword3', 'keyword4'],
		},
	} as unknown as Dataset;

	beforeEach(() => {
		vi.spyOn(useThemesHook, 'useThemes').mockReturnValue({
			data: [
				{ value: 'theme1', label: 'Theme 1' },
				{ value: 'theme2', label: 'Theme 2' },
			],
		} as any);

		vi.spyOn(useOrganizationsHook, 'useOrganizations').mockReturnValue({
			data: [
				{ id: 'org1', label: 'Organization 1' },
				{ id: 'org2', label: 'Organization 2' },
				{ id: 'org3', label: 'Organization 3' },
			],
		} as any);

		vi.spyOn(useCodesListHook, 'useCodesList').mockImplementation(
			(notation) => {
				switch (notation) {
					case 'CL_ACCESS_RIGHTS':
						return {
							codes: [
								{ iri: 'CL_ACCESS_RIGHTS', labelLg1: 'CL_ACCESS_RIGHTS' },
							],
						} as CodesList;
					case 'CL_FREQ':
						return {
							codes: [{ iri: 'CL_FREQ', labelLg1: 'CL_FREQ' }],
						} as CodesList;
					case 'CL_CONF_STATUS':
						return {
							codes: [{ iri: 'CL_CONF_STATUS', labelLg1: 'CL_CONF_STATUS' }],
						} as CodesList;
					default:
						return {} as CodesList;
				}
			},
		);
	});

	it('should render the GlobalInformationBlock with correct data', () => {
		render(<GlobalInformationBlock dataset={mockDataset} />);

		screen.getByText(/Creation Date/i);
		screen.getByText(/01\/01\/2021/i);
		screen.getByText(/Modification Date/i);
		screen.getByText(/01\/01\/2022/i);
		screen.getByText(/Date of the first diffusion of the data/i);
		screen.getByText(/06\/01\/2021/i);
	});

	it('should return null if organizations data is not available', () => {
		vi.spyOn(useOrganizationsHook, 'useOrganizations').mockReturnValue({
			data: undefined,
		} as any);

		const { container } = render(
			<GlobalInformationBlock dataset={mockDataset} />,
		);

		expect(container.firstChild).toBeNull();
	});
});
