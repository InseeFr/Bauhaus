import {
	render,
	fireEvent,
	getByText,
	act,
	waitFor,
} from '@testing-library/react';
import { CodesListPanelDumb as CodesListPanel } from './codes-list-panel';

describe('CodesListPanel', () => {
	it('should open the panel', () => {
		const handleBack = jest.fn();
		const { container } = render(
			<CodesListPanel isOpen={true} handleBack={handleBack} />
		);
		expect(
			container.querySelector('.sliding-panel-container.active')
		).not.toBeNull();
	});
	it('should close the panel', () => {
		const handleBack = jest.fn();
		const { container } = render(
			<CodesListPanel isOpen={false} handleBack={handleBack} />
		);
		expect(
			container.querySelector('.sliding-panel-container.active')
		).toBeNull();
	});
	it('should not call the API if the panel is closed', () => {
		const handleBack = jest.fn();

		const getCodesList = jest.fn().mockImplementation(() => {
			return Promise.resolve({ codes: [] });
		});
		const getPartialCodesList = jest.fn().mockImplementation(() => {
			return {
				codes: {},
			};
		});
		render(
			<CodesListPanel
				codesList={{ notation: 'notation' }}
				isOpen={false}
				getCodesList={getCodesList}
				getPartialCodesList={getPartialCodesList}
				handleBack={handleBack}
			/>
		);
		expect(getCodesList).not.toHaveBeenCalled();
	});
	it('should call the API if the panel is opened', () => {
		const handleBack = jest.fn();

		const getCodesList = jest.fn().mockImplementation(() => {
			return Promise.resolve({ codes: [] });
		});
		const getPartialCodesList = jest.fn().mockImplementation(() => {
			return {
				codes: {},
			};
		});

		act(() => {
			render(
				<CodesListPanel
					codesList={{ notation: 'notation' }}
					isOpen={true}
					getCodesList={getCodesList}
					getPartialCodesList={getPartialCodesList}
					handleBack={handleBack}
				/>
			);
		});
		expect(getCodesList).toHaveBeenCalled();
	});
	it('should call handleBack if we click on the button', () => {
		const handleBack = jest.fn();
		const { container } = render(
			<CodesListPanel isOpen={true} handleBack={handleBack} />
		);
		fireEvent.click(getByText(container, 'Cancel'));
		expect(handleBack).toHaveBeenCalled();
	});
	it('should display the sorted list of codes', async () => {
		const handleBack = jest.fn();

		const getCodesList = jest.fn().mockImplementation(() => {
			return Promise.resolve({
				codes: [
					{ code: 'B', labelLg1: 'labelLg2' },
					{ code: 'A', labelLg1: 'labelLg1' },
				],
			});
		});
		const getPartialCodesList = jest.fn().mockImplementation(() => {
			return {
				codes: {},
			};
		});

		let container;
		act(() => {
			container = render(
				<CodesListPanel
					codesList={{ notation: 'notation' }}
					isOpen={true}
					getCodesList={getCodesList}
					getPartialCodesList={getPartialCodesList}
					handleBack={handleBack}
				/>
			).container;
		});

		await waitFor(() => {
			expect(container.querySelector('li:nth-child(1)').innerHTML).toBe(
				'A - labelLg1'
			);
			expect(container.querySelector('li:nth-child(2)').innerHTML).toBe(
				'B - labelLg2'
			);
		});
	});
	it('should display the sorted list of codes from a partial list', async () => {
		const handleBack = jest.fn();

		const getCodesList = jest.fn().mockImplementation(() => {
			return Promise.resolve({});
		});
		const getPartialCodesList = jest.fn().mockImplementation(() => {
			return {
				codes: {
					B: { code: 'B', labelLg1: 'labelLg2' },
					A: { code: 'A', labelLg1: 'labelLg1' },
				},
			};
		});

		let container;
		act(() => {
			container = render(
				<CodesListPanel
					codesList={{ notation: 'notation' }}
					isOpen={true}
					getCodesList={getCodesList}
					getPartialCodesList={getPartialCodesList}
					handleBack={handleBack}
				/>
			).container;
		});

		await waitFor(() => {
			expect(container.querySelector('li:nth-child(1)').innerHTML).toBe(
				'A - labelLg1'
			);
			expect(container.querySelector('li:nth-child(2)').innerHTML).toBe(
				'B - labelLg2'
			);
		});
	});
});
