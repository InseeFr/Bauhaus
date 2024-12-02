import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import D from '../../../deprecated-locales/build-dictionary';
import ExportButtons from './';

describe('ExportButtons Component', () => {
	it('should render all buttons with the correct labels', () => {
		render(<ExportButtons exportHandler={vi.fn()} disabled={false} />);

		screen.getByText(D.btnOdsExporter);
		screen.getByText(D.btnOdtLg1Exporter);
		screen.getByText(D.btnOdtLg2Exporter);
		screen.getByText(D.btnCollectionConceptExporter);
	});

	it('should call exportHandler with correct arguments when buttons are clicked', () => {
		const mockExportHandler = vi.fn();

		render(
			<ExportButtons exportHandler={mockExportHandler} disabled={false} />,
		);

		fireEvent.click(screen.getByText(D.btnOdsExporter));
		expect(mockExportHandler).toHaveBeenCalledWith('ods', false);

		fireEvent.click(screen.getByText(D.btnOdtLg1Exporter));
		expect(mockExportHandler).toHaveBeenCalledWith('odt', false);

		fireEvent.click(screen.getByText(D.btnOdtLg2Exporter));
		expect(mockExportHandler).toHaveBeenCalledWith('odt', false, 'lg2');

		fireEvent.click(screen.getByText(D.btnCollectionConceptExporter));
		expect(mockExportHandler).toHaveBeenCalledWith('odt', true);
	});

	it('should disable buttons when disabled is true', () => {
		render(<ExportButtons exportHandler={vi.fn()} disabled={true} />);

		const button = screen.getByText('Export') as HTMLButtonElement;
		expect(button.getAttribute('disabled')).toBeDefined();
	});

	it('should enable buttons when disabled is false', () => {
		render(<ExportButtons exportHandler={vi.fn()} disabled={false} />);

		const button = screen.getByText('Export') as HTMLButtonElement;
		expect(button.getAttribute('disabled')).toBeNull();
	});
});
