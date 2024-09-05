import React from 'react';
import { render } from '@testing-library/react';
import { ComponentsPanel } from './components-panel';
import { getFormattedCodeList } from '../../apis';
import { ConceptsApi } from '../../../sdk';
import { CodesListPanel } from '../../components/codes-list-panel/codes-list-panel';
import { StructureComponentsSelector } from '../../components/structure-component-selector';

jest.mock('../../components/codes-list-panel/codes-list-panel', () => ({
	CodesListPanel: jest.fn(() => (
		<div data-testid="codes-list-panel">CodesListPanel Mock</div>
	)),
}));

jest.mock('../../components/structure-component-selector', () => ({
	StructureComponentsSelector: jest.fn(() => (
		<div data-testid="codes-list-panel">Structure Component Selector Mock</div>
	)),
}));

jest.mock('../../components/component-specification-modal/index', () => ({
	ComponentSpecificationModal: jest.fn(() => (
		<div data-testid="component-specification-modal">
			ComponentSpecificationModal Mock
		</div>
	)),
}));

jest.mock('../../apis', () => ({
	getFormattedCodeList: jest.fn(),
}));

jest.mock('../../../sdk', () => ({
	ConceptsApi: {
		getConceptList: jest.fn(),
	},
}));

describe('ComponentsPanel', () => {
	beforeEach(() => {
		// Mock des données
		(ConceptsApi.getConceptList as jest.Mock).mockResolvedValue([]);
		(getFormattedCodeList as jest.Mock).mockResolvedValue([]);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	fit('should render StructureComponentsSelector and CodesListPanel', async () => {
		render(<ComponentsPanel componentDefinitions={[]} />);

		expect((StructureComponentsSelector as jest.Mock).mock.calls).toHaveLength(
			1
		);
		expect((CodesListPanel as jest.Mock).mock.calls).toHaveLength(1);
	});
});
