import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { TemporalField } from './temporalField';

const mockUpdateTemporalCoverage = vi.fn();

describe('TemporalField Component', () => {
	const defaultProps = {
		temporalCoverageStartDate: '',
		temporalCoverageEndDate: '',
		temporalCoverageDataType: '',
		updateTemporalCoverage: mockUpdateTemporalCoverage,
	};

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should render date inputs when temporalCoverageDataType ends with "date"', () => {
		render(
			<TemporalField
				{...defaultProps}
				temporalCoverageDataType="http://www.w3.org/2001/XMLSchema#date"
			/>,
		);

		screen.getByLabelText(/Date de Début/i);
		screen.getByLabelText(/Date de Fin/i);
	});

	it.only('should render NumberInputs when temporalCoverageDataType ends with "Year"', () => {
		render(
			<TemporalField
				{...defaultProps}
				temporalCoverageDataType="http://www.w3.org/2001/XMLSchema#gYear"
			/>,
		);

		screen.getByLabelText(/Date de Début/i);
		screen.getByLabelText(/Date de Fin/i);
	});
});
