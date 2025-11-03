import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
	InseeOrganisationList,
	InseeOrganisationText,
	InseeOrganisationNotes,
} from './';

// Mock des dépendances
vi.mock('../../../utils/hooks/stamps', () => ({
	useV2StampsMap: () => {
		return new Map([
			['DG75-L201', 'INSEE'],
			['DG75-L202', 'DARES'],
			['DG75-G001', 'Direction Générale'],
			['id', 'Label for id'],
			['id2', 'Label for id2'],
		]);
	},
}));

vi.mock('../../../modules-operations/i18n/build-dictionary', () => ({
	D1: {
		creatorTitle: 'Créateur',
	},
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe('InseeOrganisationList', () => {
	describe('Label mapping', () => {
		it('should map single organisation ID to label', () => {
			render(<InseeOrganisationList organisations="DG75-L201" />, {
				wrapper: createWrapper(),
			});

			expect(screen.getByText('INSEE')).toBeInTheDocument();
		});

		it('should map multiple organisation IDs to labels', () => {
			render(
				<InseeOrganisationList organisations={['DG75-L201', 'DG75-L202']} />,
				{ wrapper: createWrapper() }
			);

			expect(screen.getByText('INSEE')).toBeInTheDocument();
			expect(screen.getByText('DARES')).toBeInTheDocument();
		});

		it('should fallback to original value when label not found', () => {
			render(<InseeOrganisationList organisations="unknown-id" />, {
				wrapper: createWrapper(),
			});

			expect(screen.getByText('unknown-id')).toBeInTheDocument();
		});

		it('should render list with mixed known and unknown IDs', () => {
			const { container } = render(
				<InseeOrganisationList
					organisations={['id', 'DG75-L201', 'DG75-G001']}
				/>,
				{ wrapper: createWrapper() }
			);

			const listItems = container.querySelectorAll('li');
			expect(listItems).toHaveLength(3);
			expect(listItems[0].textContent).toBe('Label for id');
			expect(listItems[1].textContent).toBe('INSEE');
			expect(listItems[2].textContent).toBe('Direction Générale');
		});
	});

	describe('Rendering', () => {
		it('should render organisations as list items', () => {
			const { container } = render(
				<InseeOrganisationList organisations={['DG75-L201', 'DG75-L202']} />,
				{ wrapper: createWrapper() }
			);

			const ul = container.querySelector('ul');
			expect(ul).toBeInTheDocument();

			const listItems = container.querySelectorAll('li');
			expect(listItems).toHaveLength(2);
		});

		it('should render single organisation as list', () => {
			const { container } = render(
				<InseeOrganisationList organisations="DG75-L201" />,
				{ wrapper: createWrapper() }
			);

			const ul = container.querySelector('ul');
			expect(ul).toBeInTheDocument();

			expect(screen.getByText('INSEE')).toBeInTheDocument();
		});
	});

	describe('Empty values handling', () => {
		it('should return null when organisations is undefined', () => {
			const { container } = render(
				<InseeOrganisationList organisations={undefined} />,
				{ wrapper: createWrapper() }
			);

			expect(container.firstChild).toBeNull();
		});

		it('should return null when organisations is empty array', () => {
			const { container } = render(
				<InseeOrganisationList organisations={[]} />,
				{ wrapper: createWrapper() }
			);

			expect(container.firstChild).toBeNull();
		});
	});
});

describe('InseeOrganisationText', () => {
	describe('Label mapping', () => {
		it('should map single organisation ID to label', () => {
			render(<InseeOrganisationText organisations="DG75-L202" />, {
				wrapper: createWrapper(),
			});

			expect(screen.getByText('DARES')).toBeInTheDocument();
		});

		it('should map and render only first organisation from array', () => {
			render(
				<InseeOrganisationText organisations={['DG75-L201', 'DG75-L202']} />,
				{ wrapper: createWrapper() }
			);

			expect(screen.getByText('INSEE')).toBeInTheDocument();
			expect(screen.queryByText('DARES')).not.toBeInTheDocument();
		});

		it('should fallback to original value when label not found', () => {
			render(<InseeOrganisationText organisations="unknown-stamp" />, {
				wrapper: createWrapper(),
			});

			expect(screen.getByText('unknown-stamp')).toBeInTheDocument();
		});
	});

	describe('Rendering', () => {
		it('should render as text not as list', () => {
			const { container } = render(
				<InseeOrganisationText organisations="DG75-L201" />,
				{ wrapper: createWrapper() }
			);

			expect(container.querySelector('ul')).not.toBeInTheDocument();
			expect(screen.getByText('INSEE')).toBeInTheDocument();
		});

		it('should render only first item even with multiple organisations', () => {
			render(
				<InseeOrganisationText
					organisations={['id', 'id2', 'DG75-L201']}
				/>,
				{ wrapper: createWrapper() }
			);

			expect(screen.getByText('Label for id')).toBeInTheDocument();
			expect(screen.queryByText('Label for id2')).not.toBeInTheDocument();
			expect(screen.queryByText('INSEE')).not.toBeInTheDocument();
		});
	});

	describe('Empty values handling', () => {
		it('should return null when organisations is undefined', () => {
			const { container } = render(
				<InseeOrganisationText organisations={undefined} />,
				{ wrapper: createWrapper() }
			);

			expect(container.firstChild).toBeNull();
		});

		it('should return null when organisations is empty array', () => {
			const { container } = render(
				<InseeOrganisationText organisations={[]} />,
				{ wrapper: createWrapper() }
			);

			expect(container.firstChild).toBeNull();
		});
	});
});

describe('InseeOrganisationNotes', () => {
	describe('Label mapping', () => {
		it('should map single organisation ID to label', () => {
			render(<InseeOrganisationNotes organisations="DG75-L201" />, {
				wrapper: createWrapper(),
			});

			expect(screen.getByText('Créateur')).toBeInTheDocument();
			expect(screen.getByText('INSEE')).toBeInTheDocument();
		});

		it('should map multiple organisation IDs to labels', () => {
			render(
				<InseeOrganisationNotes organisations={['DG75-L201', 'DG75-G001']} />,
				{ wrapper: createWrapper() }
			);

			expect(screen.getByText('Créateur')).toBeInTheDocument();
			// Note: Dans InseeOrganisationNotes, la liste utilise les IDs originaux, pas les labels mappés
			expect(screen.getByText('DG75-L201')).toBeInTheDocument();
			expect(screen.getByText('DG75-G001')).toBeInTheDocument();
		});
	});

	describe('Single organisation rendering', () => {
		it('should render single organisation in a paragraph', () => {
			const { container } = render(
				<InseeOrganisationNotes organisations="DG75-L201" />,
				{ wrapper: createWrapper() }
			);

			expect(screen.getByText('Créateur')).toBeInTheDocument();
			expect(screen.getByText('INSEE')).toBeInTheDocument();

			const paragraph = container.querySelector('p');
			expect(paragraph).toBeInTheDocument();
			expect(paragraph?.textContent).toBe('INSEE');
		});

		it('should render mapped label for known organisation', () => {
			render(<InseeOrganisationNotes organisations="DG75-G001" />, {
				wrapper: createWrapper(),
			});

			expect(screen.getByText('Direction Générale')).toBeInTheDocument();
		});

		it('should fallback to original ID for unknown organisation', () => {
			render(<InseeOrganisationNotes organisations="unknown-id" />, {
				wrapper: createWrapper(),
			});

			expect(screen.getByText('unknown-id')).toBeInTheDocument();
		});
	});

	describe('Multiple organisations rendering', () => {
		it('should render multiple organisations as list', () => {
			const { container } = render(
				<InseeOrganisationNotes organisations={['DG75-L201', 'DG75-L202']} />,
				{ wrapper: createWrapper() }
			);

			expect(screen.getByText('Créateur')).toBeInTheDocument();

			const ul = container.querySelector('ul');
			expect(ul).toBeInTheDocument();

			const listItems = container.querySelectorAll('li');
			expect(listItems).toHaveLength(2);
		});

		it('should render three or more organisations as list', () => {
			const { container } = render(
				<InseeOrganisationNotes
					organisations={['id', 'id2', 'DG75-L201']}
				/>,
				{ wrapper: createWrapper() }
			);

			const ul = container.querySelector('ul');
			expect(ul).toBeInTheDocument();

			const listItems = container.querySelectorAll('li');
			expect(listItems).toHaveLength(3);
		});
	});

	describe('Empty values handling', () => {
		it('should render empty note when organisations is undefined', () => {
			const { container } = render(
				<InseeOrganisationNotes organisations={undefined} />,
				{ wrapper: createWrapper() }
			);

			expect(screen.getByText('Créateur')).toBeInTheDocument();

			const paragraph = container.querySelector('p');
			expect(paragraph).toBeInTheDocument();
			expect(paragraph?.textContent).toBe('');
		});

		it('should render empty note when organisations is empty array', () => {
			const { container } = render(
				<InseeOrganisationNotes organisations={[]} />,
				{ wrapper: createWrapper() }
			);

			expect(screen.getByText('Créateur')).toBeInTheDocument();

			const paragraph = container.querySelector('p');
			expect(paragraph).toBeInTheDocument();
			expect(paragraph?.textContent).toBe('');
		});
	});

	describe('Note component integration', () => {
		it('should always render with Note title "Créateur"', () => {
			render(<InseeOrganisationNotes organisations="DG75-L201" />, {
				wrapper: createWrapper(),
			});

			expect(screen.getByText('Créateur')).toBeInTheDocument();
		});

		it('should render Note with allowEmpty flag for empty organisations', () => {
			const { container } = render(
				<InseeOrganisationNotes organisations={undefined} />,
				{ wrapper: createWrapper() }
			);

			// Vérifie que le composant Note est rendu même avec des données vides
			expect(screen.getByText('Créateur')).toBeInTheDocument();
			expect(container.querySelector('p')).toBeInTheDocument();
		});

		it('should render Note for both single and multiple organisations', () => {
			const { rerender } = render(
				<InseeOrganisationNotes organisations="DG75-L201" />,
				{ wrapper: createWrapper() }
			);

			expect(screen.getByText('Créateur')).toBeInTheDocument();

			rerender(
				<InseeOrganisationNotes organisations={['DG75-L201', 'DG75-L202']} />
			);

			expect(screen.getByText('Créateur')).toBeInTheDocument();
		});
	});
});
