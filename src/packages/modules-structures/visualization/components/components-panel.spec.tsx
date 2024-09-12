import { render } from '@testing-library/react';
import { ComponentsPanel } from './components-panel';
import { getFormattedCodeList } from '../../apis';
import { ConceptsApi } from '../../../sdk';
import { CodesListPanel } from '../../components/codes-list-panel/codes-list-panel';
import { StructureComponentsSelector } from '../../components/structure-component-selector';
import { Mock, vi } from 'vitest';

vi.mock('../../components/codes-list-panel/codes-list-panel', () => ({
	CodesListPanel: vi.fn(() => (
		<div data-testid="codes-list-panel">CodesListPanel Mock</div>
	)),
}));

vi.mock('../../components/structure-component-selector', () => ({
	StructureComponentsSelector: vi.fn(() => (
		<div data-testid="codes-list-panel">Structure Component Selector Mock</div>
	)),
}));

vi.mock('../../components/component-specification-modal/index', () => ({
	ComponentSpecificationModal: vi.fn(() => (
		<div data-testid="component-specification-modal">
			ComponentSpecificationModal Mock
		</div>
	)),
}));

vi.mock('../../apis', () => ({
	getFormattedCodeList: vi.fn(),
}));

vi.mock('../../../sdk', () => ({
	ConceptsApi: {
		getConceptList: vi.fn(),
	},
}));

describe('ComponentsPanel', () => {
	beforeEach(() => {
		// Mock des données
		(ConceptsApi.getConceptList as Mock).mockResolvedValue([]);
		(getFormattedCodeList as Mock).mockResolvedValue([]);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should render StructureComponentsSelector and CodesListPanel', async () => {
		render(<ComponentsPanel componentDefinitions={[]} />);

		expect((StructureComponentsSelector as Mock).mock.calls).toHaveLength(1);
		expect((CodesListPanel as jest.Mock).mock.calls).toHaveLength(1);
	});
});
