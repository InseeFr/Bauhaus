import React from 'react';
import { findByLabelText, getByLabelText, render, screen } from '@testing-library/react';
import { ComponentSpecificationForm } from './index';

describe('ComponentSpecificationForm', () => {
	it('should render form inputs', async () => {
		const component = {}
		render(<ComponentSpecificationForm component={component} structureComponents={[]} selectedComponent={{ component }}/>);
		await screen.findByLabelText("Notation")
		await screen.findByLabelText("Libellé")
		await screen.findByLabelText("Label")
	})
})
