import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { DOCUMENT, LINK } from '../utils';
import OperationsDocumentationEdition from './edition';

const queryClient = new QueryClient();

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
