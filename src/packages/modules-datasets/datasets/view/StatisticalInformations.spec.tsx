import React from 'react';
import { render } from '@testing-library/react';
import { StatisticalInformations } from './StatisticalInformations'; // Assurez-vous que le chemin vers le composant est correct
import { Dataset } from '../../../model/Dataset';
import * as hooks from '../../../utils/hooks/codeslist';
import * as structureHooks from '../../../utils/hooks/structures';

jest.mock('../../../utils/hooks/codeslist');
jest.mock('../../../utils/hooks/structures');

describe('StatisticalInformations Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const mockDataset = {
		type: 'type1',
		statisticalUnit: ['unit1'],
		dataStructure: 'structure1',
		temporalCoverageDataType: 'dataType1',
		temporalCoverageStartDate: '2023-01-01',
		temporalCoverageEndDate: '2023-12-31',
		temporalResolution: 'resolution1',
		spacialCoverage: 'geo1',
		spacialTemporal: '2023-05-01',
		spacialResolutions: ['resolutionGeo1'],
		observationNumber: 100,
		timeSeriesNumber: 10,
	} as unknown as Dataset;

	const mockStructures = [{ iri: 'structure1', labelLg1: 'Structure 1' }];

	it('renders all statistical information correctly', () => {
		(hooks.useCodesList as jest.Mock).mockReturnValue([]);
		(structureHooks.useStructures as jest.Mock).mockReturnValue({
			data: mockStructures,
		});

		const { getByText } = render(
			<StatisticalInformations dataset={mockDataset} />
		);

		getByText('Data structure : Structure 1');
		getByText('Number of observation : 100');
		getByText('Number of time-series : 10');
	});

	it('renders conditional fields correctly', () => {
		(hooks.useCodesList as jest.Mock).mockReturnValue([]);
		(structureHooks.useStructures as jest.Mock).mockReturnValue({
			data: mockStructures,
		});

		const datasetWithoutOptionalFields: Dataset = {
			...mockDataset,
			observationNumber: undefined,
			timeSeriesNumber: undefined,
		} as unknown as Dataset;

		const { queryByText } = render(
			<StatisticalInformations dataset={datasetWithoutOptionalFields} />
		);

		expect(queryByText('100')).toBeNull();
		expect(queryByText('10')).toBeNull();
	});
});
