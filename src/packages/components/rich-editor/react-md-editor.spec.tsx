import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi, expect } from 'vitest';

import { MDEditor } from './react-md-editor';

vi.mock('@uiw/react-md-editor', () => {
	return {
		default: ({
			value,
			onChange,
		}: {
			value: string;
			onChange: (value?: string) => void;
		}) => (
			<textarea
				data-testid="editor"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		),
	};
});

describe('MDEditor component', () => {
	it('should render the editor with the initial text', () => {
		const mockHandleChange = vi.fn();
		const initialText = 'Initial text';

		render(<MDEditor text={initialText} handleChange={mockHandleChange} />);

		const editor = screen.getByTestId('editor') as HTMLInputElement;
		expect(editor).toBeInTheDocument();
		expect(editor.value).toBe(initialText);
	});

	it('should call handleChange when the text is updated', async () => {
		const mockHandleChange = vi.fn();
		const initialText = '';
		const newText = 'Updated text';

		render(<MDEditor text={initialText} handleChange={mockHandleChange} />);

		const editor = screen.getByTestId('editor');
		await userEvent.clear(editor);
		await userEvent.type(editor, newText);

		expect(mockHandleChange).toHaveBeenCalledTimes(12);
	});
});
