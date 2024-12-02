import FileSaver from 'file-saver';
import { vi } from 'vitest';

import { saveFileFromHttpResponse } from './files';

vi.mock('file-saver', () => ({
	default: {
		saveAs: vi.fn(),
	},
}));

describe('saveFileFromHttpResponse', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	it('should reject if Content-Disposition header is missing', async () => {
		const response = new Response(null, {
			headers: new Headers({}),
		});

		await expect(saveFileFromHttpResponse(response)).rejects.toBeUndefined();
		expect(console.error).toHaveBeenCalledWith(
			'Unable to download the File due to a missing Content-Disposition header',
		);
	});

	it('should reject if Content-Disposition header is invalid', async () => {
		const response = new Response(null, {
			headers: new Headers({
				'Content-Disposition': 'invalid-header',
			}),
		});

		await expect(saveFileFromHttpResponse(response)).rejects.toBeUndefined();
		expect(console.error).toHaveBeenCalledWith(
			'Unable to parse the Content-Disposition header',
		);
	});

	it('should save file with correct file name from Content-Disposition header', async () => {
		const blob = new Blob(['test content'], { type: 'text/plain' });
		const response = new Response(blob, {
			headers: new Headers({
				'Content-Disposition': 'attachment; filename="testfile.txt"',
			}),
		});

		await saveFileFromHttpResponse(response);

		expect(FileSaver.saveAs).toHaveBeenCalledWith(
			expect.anything(),
			'testfile.txt',
		);
	});
});
