import { fireEvent, render, screen } from '@testing-library/react';
import ConceptVisualizationControls from './controls';
import { MemoryRouter } from 'react-router-dom';
import api from '../../../remote-api/concepts-api';
import FileSaver from 'file-saver';

jest.mock('../../../remote-api/concepts-api');
jest.mock('file-saver');
describe('concept-visualization-controls', () => {
	it('renders without crashing', () => {
		render(
			<ConceptVisualizationControls
				id="id"
				creator="creator"
				isValidated={false}
				conceptVersion="1"
				handleValidation={jest.fn()}
				permission={{ authType: '', roles: [''] }}
			/>,
			{ wrapper: MemoryRouter }
		);
	});

	it('should see the export button', async () => {
		FileSaver.saveAs = jest.fn().mockImplementation(() => Promise.resolve());
		api.getConceptExport = jest.fn().mockImplementation(() => {
			return Promise.resolve({
				headers: {
					get() {
						return 'attachment; filename="filename.jpg"';
					},
				},
				blob() {
					return Promise.resolve('blob');
				},
			});
		});

		render(
			<ConceptVisualizationControls
				id="id"
				creator="creator"
				isValidated={false}
				conceptVersion="1"
				handleValidation={jest.fn()}
				permission={{ authType: '', roles: [''] }}
			/>,
			{ wrapper: MemoryRouter }
		);

		const exportButton = await screen.findByText('Export');
		fireEvent.click(exportButton);

		expect(api.getConceptExport).toHaveBeenCalledWith(
			'id',
			'application/vnd.oasis.opendocument.text'
		);
	});
});
