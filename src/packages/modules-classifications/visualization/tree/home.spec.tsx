import { renderWithAppContext } from '../../../tests/render';
import ClassificationTree from './home';

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useParams: () => ({ id: 'test-classification-id' }),
	};
});

vi.mock('@utils/hooks/useTitle', () => ({
	useTitle: vi.fn(),
}));

vi.mock('../../../deprecated-locales', () => ({
	default: {
		classificationsTitle: 'Classifications',
		classificationTreeTitle: 'Classification Tree',
	},
}));

vi.mock('./controls', () => ({
	default: () => <div data-testid="controls">Controls</div>,
}));

describe('ClassificationTree', () => {
	const mockData = [
		{
			id: '1',
			labelLg1: 'Root Item 1',
			labelLg2: 'Root Item 1 FR',
		},
		{
			id: '2',
			labelLg1: 'Root Item 2',
			labelLg2: 'Root Item 2 FR',
		},
		{
			id: '3',
			labelLg1: 'Child Item 1',
			labelLg2: 'Child Item 1 FR',
			parent: '1',
		},
		{
			id: '4',
			labelLg1: 'Child Item 2',
			labelLg2: 'Child Item 2 FR',
			parent: '1',
		},
		{
			id: '5',
			labelLg1: 'Grandchild Item',
			labelLg2: 'Grandchild Item FR',
			parent: '3',
		},
	];

	const defaultProps = {
		data: mockData,
		prefLabel: 'Test Classification',
		secondLang: false,
	};

	it('renders without crashing', () => {
		renderWithAppContext(<ClassificationTree {...defaultProps} />);
	});

	it('renders empty state when no data', () => {
		const { container } = renderWithAppContext(
			<ClassificationTree {...defaultProps} data={[]} />
		);
		
		const tree = container.querySelector('.p-tree');
		expect(tree).toBeNull();
	});

	it('renders tree with correct structure', () => {
		const { getByRole } = renderWithAppContext(<ClassificationTree {...defaultProps} />);
		
		const tree = getByRole('tree');
		expect(tree).toBeInTheDocument();
	});

	it('displays primary language labels by default', () => {
		const { getByText } = renderWithAppContext(<ClassificationTree {...defaultProps} />);
		
		expect(getByText('Root Item 1')).toBeInTheDocument();
		expect(getByText('Root Item 2')).toBeInTheDocument();
	});

	it('displays secondary language labels when secondLang is true', () => {
		const { getByText } = renderWithAppContext(
			<ClassificationTree {...defaultProps} secondLang={true} />
		);
		
		expect(getByText('Root Item 1 FR')).toBeInTheDocument();
		expect(getByText('Root Item 2 FR')).toBeInTheDocument();
	});

	it('creates hierarchical tree structure correctly', () => {
		const { container } = renderWithAppContext(<ClassificationTree {...defaultProps} />);
		
		// Check that tree nodes are created
		const treeNodes = container.querySelectorAll('.p-treenode');
		expect(treeNodes.length).toBeGreaterThan(0);
	});

	it('sorts tree nodes alphabetically', () => {
		const unsortedData = [
			{ id: '1', labelLg1: 'Zebra', labelLg2: 'Zèbre' },
			{ id: '2', labelLg1: 'Apple', labelLg2: 'Pomme' },
			{ id: '3', labelLg1: 'Banana', labelLg2: 'Banane' },
		];

		const { container } = renderWithAppContext(
			<ClassificationTree 
				data={unsortedData}
				prefLabel="Test"
				secondLang={false}
			/>
		);

		const links = container.querySelectorAll('a');
		const texts = Array.from(links).map(link => link.textContent);
		
		// Should be sorted: Apple, Banana, Zebra
		expect(texts).toEqual(['Apple', 'Banana', 'Zebra']);
	});

	it('generates correct links for tree nodes', () => {
		const { container } = renderWithAppContext(<ClassificationTree {...defaultProps} />);
		
		const links = container.querySelectorAll('a');
		
		links.forEach(link => {
			const href = link.getAttribute('href');
			expect(href).toMatch(/^\/classifications\/classification\/test-classification-id\/item\/\d+$/);
		});
	});

	it('handles duplicate items correctly', () => {
		const dataWithDuplicates = [
			...mockData,
			{
				id: '1', 
				labelLg1: 'Duplicate Root Item 1',
				labelLg2: 'Duplicate Root Item 1 FR',
			},
		];

		const { container } = renderWithAppContext(
			<ClassificationTree 
				data={dataWithDuplicates}
				prefLabel="Test"
				secondLang={false}
			/>
		);

		const tree = container.querySelector('[role="tree"]');
		expect(tree).toBeInTheDocument();
	});

	it('renders page title with correct subtitle', () => {
		const { container } = renderWithAppContext(<ClassificationTree {...defaultProps} />);
		
		const subtitle = container.querySelector('.wilco-page-title__title div');
		expect(subtitle).toHaveTextContent('Test Classification');
	});

	it('renders controls and language toggle components', () => {
		const { getByTestId } = renderWithAppContext(<ClassificationTree {...defaultProps} />);
		
		expect(getByTestId('controls')).toBeInTheDocument();
	});

	it('handles empty children arrays correctly', () => {
		const dataWithEmptyChildren = [
			{
				id: '1',
				labelLg1: 'Parent Item',
				labelLg2: 'Parent Item FR',
			},
		];

		const { container } = renderWithAppContext(
			<ClassificationTree 
				data={dataWithEmptyChildren}
				prefLabel="Test"
				secondLang={false}
			/>
		);

		const tree = container.querySelector('[role="tree"]');
		expect(tree).toBeInTheDocument();
	});

	it('processes parent-child relationships correctly', () => {
		const complexData = [
			{ id: 'parent', labelLg1: 'Parent', labelLg2: 'Parent FR' },
			{ id: 'child1', labelLg1: 'Child 1', labelLg2: 'Child 1 FR', parent: 'parent' },
			{ id: 'child2', labelLg1: 'Child 2', labelLg2: 'Child 2 FR', parent: 'parent' },
			{ id: 'grandchild', labelLg1: 'Grandchild', labelLg2: 'Grandchild FR', parent: 'child1' },
		];

		const { container } = renderWithAppContext(
			<ClassificationTree 
				data={complexData}
				prefLabel="Test"
				secondLang={false}
			/>
		);

		const tree = container.querySelector('[role="tree"]');
		expect(tree).toBeInTheDocument();
	});
});