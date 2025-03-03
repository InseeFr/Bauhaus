import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';

import { useDisseminationStatusOptions } from '../../utils/hooks/disseminationStatus';
import D from '../i18n';
import {
	DisseminationStatusVisualisation,
	DisseminationStatusInput,
	getDisseminationStatus,
} from './disseminationStatus';

vi.mock('../../utils/hooks/disseminationStatus', () => ({
	useDisseminationStatusOptions: vi.fn(),
}));

describe('getDisseminationStatus', () => {
	it('returns correct title for PublicGenerique', () => {
		expect(getDisseminationStatus('/PublicGenerique')).toBe(
			D.disseminationStatus.DSPublicGeneriqueTitle,
		);
	});

	it('returns correct title for PublicSpecifique', () => {
		expect(getDisseminationStatus('/PublicSpecifique')).toBe(
			D.disseminationStatus.DSPublicSpecifiqueTitle,
		);
	});

	it('returns correct title for Prive', () => {
		expect(getDisseminationStatus('/Prive')).toBe(
			D.disseminationStatus.DSPrivateTitle,
		);
	});

	it('returns empty string for unknown status', () => {
		expect(getDisseminationStatus('Unknown')).toBe('');
	});
});

describe('DisseminationStatusVisualisation', () => {
	it('renders correct dissemination status', () => {
		render(
			<DisseminationStatusVisualisation disseminationStatus="/PublicGenerique" />,
		);
		expect(
			screen.getByText(
				`${D.disseminationStatus.title} : ${D.disseminationStatus.DSPublicGeneriqueTitle}`,
			),
		).toBeInTheDocument();
	});
});

describe('DisseminationStatusInput', () => {
	it('renders label if withLabel is true', () => {
		(useDisseminationStatusOptions as Mock).mockReturnValue([
			{ value: 'PublicGenerique', label: 'Public' },
		]);
		render(
			<DisseminationStatusInput
				value="PublicGenerique"
				handleChange={() => {}}
				required
				withLabel
			/>,
		);
		expect(screen.getByText(D.disseminationStatus.title)).toBeInTheDocument();
	});

	it('renders required label when required is true', () => {
		(useDisseminationStatusOptions as Mock).mockReturnValue([
			{ value: 'PublicGenerique', label: 'Public' },
		]);
		render(
			<DisseminationStatusInput
				value="PublicGenerique"
				handleChange={() => {}}
				required
			/>,
		);
		expect(screen.getByText(D.disseminationStatus.title)).toBeInTheDocument();
	});
});
