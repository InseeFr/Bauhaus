import DisplayLinks from './index';
import { renderWithRouter } from '../../../../new-architecture/tests-utils/render';

const langs = {
	lg1: 'fr',
	lg2: 'en',
};

describe('DisplayLinks', () => {
	it('should display a list if we have multiple item', () => {
		const links = [{ id: 1 }, { id: 2 }];
		const { container } = renderWithRouter(
			<DisplayLinks links={links} langs={langs} path="series/" title="home" />
		);
		expect(container.innerHTML).toContain('<li><a href="/series/1">');
		expect(container.innerHTML).toContain('<li><a href="/series/2">');
	});
	it('should display a paragraph if we have only one item', () => {
		const links = [{ id: 1 }];
		const { container } = renderWithRouter(
			<DisplayLinks links={links} langs={langs} path="series/" title="home" />
		);

		expect(container.innerHTML).toContain(
			'<div class="panel-body"><a href="/series/1">'
		);
	});
	it('should not display a link', () => {
		const links = [{ id: 1, labelLg1: 'labelLg1' }];
		const { container } = renderWithRouter(
			<DisplayLinks
				links={links}
				langs={langs}
				path="series/"
				displayLink={false}
				title="home"
			/>
		);
		expect(container.innerHTML).toContain('<p>labelLg1');
	});
});
