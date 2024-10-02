import { PageTitleBlock } from './';
import { renderWithAppContext } from '../../tests-utils/render';
import { vi } from 'vitest';
import { useSecondLang } from '../../utils/hooks/second-lang';

vi.mock('../../utils/hooks/second-lang', () => ({
	useSecondLang: vi.fn(),
}));

describe('page-title-bloc', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders one PageTitle only is secondLang is false', () => {
		useSecondLang.mockReturnValue([false]);

		const { container } = renderWithAppContext(
			<PageTitleBlock titleLg1="titleLg1" />,
		);
		expect(container.querySelectorAll('h2')).toHaveLength(1);
		expect(container.querySelectorAll('h2 div')).toHaveLength(0);
	});

	it('renders one PageTitle only if titleLg2 is undefined', () => {
		useSecondLang.mockReturnValue([true]);
		const { container } = renderWithAppContext(
			<PageTitleBlock titleLg1="titleLg1" />,
		);
		expect(container.querySelectorAll('h2')).toHaveLength(1);
		expect(container.querySelectorAll('h2 div')).toHaveLength(0);
	});

	it('renders one PageTitle and one PageSubstitle', () => {
		useSecondLang.mockReturnValue([true]);
		const { container } = renderWithAppContext(
			<PageTitleBlock titleLg1="titleLg1" titleLg2="titleLg2" />,
		);
		expect(container.querySelectorAll('h2')).toHaveLength(1);
		expect(container.querySelectorAll('h2 div')).toHaveLength(1);
	});
});
