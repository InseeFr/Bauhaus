import { PageTitleBlock } from './';
import { renderWithAppContext } from '../../tests-utils/render';

jest.mock('../../utils/hooks/second-lang', () => ({
	useSecondLang: jest.fn(),
}));
describe('page-title-bloc', () => {
	const mockUseSecondLang = jest.requireMock(
		'../../utils/hooks/second-lang'
	).useSecondLang;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders one PageTitle only is secondLang is false', () => {
		mockUseSecondLang.mockReturnValue([false]);

		const { container } = renderWithAppContext(
			<PageTitleBlock titleLg1="titleLg1" />
		);
		expect(container.querySelectorAll('h2')).toHaveLength(1);
		expect(container.querySelectorAll('h2 div')).toHaveLength(0);
	});

	it('renders one PageTitle only if titleLg2 is undefined', () => {
		mockUseSecondLang.mockReturnValue([true]);
		const { container } = renderWithAppContext(
			<PageTitleBlock titleLg1="titleLg1" />
		);
		expect(container.querySelectorAll('h2')).toHaveLength(1);
		expect(container.querySelectorAll('h2 div')).toHaveLength(0);
	});

	it('renders one PageTitle and one PageSubstitle', () => {
		mockUseSecondLang.mockReturnValue([true]);
		const { container } = renderWithAppContext(
			<PageTitleBlock titleLg1="titleLg1" titleLg2="titleLg2" />
		);
		expect(container.querySelectorAll('h2')).toHaveLength(1);
		expect(container.querySelectorAll('h2 div')).toHaveLength(1);
	});
});
