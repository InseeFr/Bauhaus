import { render } from '@testing-library/react';

import { Code, CodesList } from '../../model/CodesList';
import { CodeDisplay } from './';

describe('CodeDisplay Component', () => {
	it('renders the correct label when a matching code is found', () => {
		const codesList: CodesList = {
			codes: [
				{ iri: 'code1', labelLg1: 'Label 1' },
				{ iri: 'code2', labelLg1: 'Label 2' },
			],
		} as CodesList;
		const value = 'code1';
		const { getByText } = render(
			<CodeDisplay codesList={codesList} value={value} />,
		);

		getByText('Label 1');
	});

	it('renders nothing when no matching code is found', () => {
		const codesList: CodesList = {
			codes: [
				{ iri: 'code1', labelLg1: 'Label 1' },
				{ iri: 'code2', labelLg1: 'Label 2' },
			],
		} as CodesList;
		const value = 'code3';
		const { container } = render(
			<CodeDisplay codesList={codesList} value={value} />,
		);

		expect(container.innerHTML).toBe('');
	});

	it('renders nothing when codesList is undefined', () => {
		const value = 'code1';
		const { container } = render(
			<CodeDisplay codesList={undefined as any} value={value} />,
		);
		expect(container.innerHTML).toBe('');
	});

	it('renders nothing when codesList is empty', () => {
		const codesList: CodesList = {
			codes: [] as Code[],
		} as CodesList;
		const value = 'code1';
		const { container } = render(
			<CodeDisplay codesList={codesList} value={value} />,
		);

		expect(container.innerHTML).toBe('');
	});
});
