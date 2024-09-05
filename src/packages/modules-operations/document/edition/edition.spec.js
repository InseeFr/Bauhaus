import { render, screen } from '@testing-library/react';
import OperationsDocumentationEdition, { ConfirmationModal } from './edition';
import { DOCUMENT, LINK } from '../utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('ConfirmationModal', () => {
	it('should display two confirmation buttons', async () => {
		render(
			<ConfirmationModal
				isOpen={true}
				document={{ sims: [] }}
				onNo={() => {}}
				onYes={() => {}}
			/>
		);
		await screen.findByText('Yes');
		await screen.findByText('No');
	});
});

describe('OperationsDocumentationEdition', () => {
	it('should render without errors', async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<OperationsDocumentationEdition
					type={DOCUMENT}
					document={{ url: 'url', sims: [] }}
					langOptions={[]}
				/>
			</QueryClientProvider>
		);
	});

	it('should display a drop zone if the type is a document', async () => {
		const { container } = render(
			<QueryClientProvider client={queryClient}>
				<OperationsDocumentationEdition
					type={DOCUMENT}
					document={{ sims: [] }}
					langOptions={[]}
				/>
			</QueryClientProvider>
		);
		expect(container.querySelector('.dropzone')).not.toBeNull();
	});

	it('should not display a drop zone if the type is a document and contain an url', async () => {
		const { container } = render(
			<QueryClientProvider client={queryClient}>
				<OperationsDocumentationEdition
					type={DOCUMENT}
					document={{ url: 'url', sims: [] }}
					langOptions={[]}
				/>
			</QueryClientProvider>
		);
		expect(container.querySelector('.dropzone')).toBeNull();
		expect(Array.from(container.querySelectorAll('.panel-body'))).toHaveLength(
			1
		);
	});
	it('should display the link url field', async () => {
		const { container } = render(
			<QueryClientProvider client={queryClient}>
				<OperationsDocumentationEdition
					type={LINK}
					document={{ url: 'url', sims: [] }}
					langOptions={[]}
				/>
			</QueryClientProvider>
		);
		expect(container.querySelector("[for='url']")).not.toBeNull();
	});
});
