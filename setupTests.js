import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';
import i18n from './src/packages/modules-concepts/i18n';

// Force language and re-trigger resource binding so react-i18next picks up
// the modules-concepts namespace, even when other module i18n initializers
// (modules-datasets/operations/etc.) run later and overwrite the singleton.
beforeEach(() => {
  i18n.changeLanguage('en');
});

// Clear all mocks before each test globally
beforeEach(() => {
	vi.clearAllMocks();
});

// Mock global pour useV2StampsMap
vi.mock('./src/packages/utils/hooks/stamps', async () => {
	const actual = await vi.importActual('./src/packages/utils/hooks/stamps');
	return {
		...actual,
		useV2StampsMap: vi.fn(() => new Map([
			['DG75-L201', 'INSEE'],
			['DG75-L202', 'DARES'],
			['DG75-G001', 'Direction Générale'],
		])),
		useV2StampsOptions: vi.fn(() => [
			{ value: 'DG75-L201', label: 'INSEE' },
			{ value: 'DG75-L202', label: 'DARES' },
			{ value: 'DG75-G001', label: 'Direction Générale' },
		]),
	};
});
