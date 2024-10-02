import SimsGeographySelector from './sims-geography-selector';
import { render } from '@testing-library/react';

describe('<SimsGeographySelector />', () => {
	it('should display a list with included zones', () => {
		const includes = [
			{ labelLg1: 'labelLg1', labelLg2: 'labelLg2', value: '1' },
		];
		const { container } = render(
			<SimsGeographySelector includes={includes} excludes={[]} />,
		);
		expect(container.querySelectorAll('.row div:nth-child(1) li')).toHaveLength(
			1,
		);
	});
	it('should display a list with excludd zones', () => {
		const excludes = [
			{ labelLg1: 'labelLg1', labelLg2: 'labelLg2', value: '1' },
		];
		const { container } = render(
			<SimsGeographySelector includes={[]} excludes={excludes} />,
		);
		expect(container.querySelectorAll('.row div:nth-child(2) li')).toHaveLength(
			1,
		);
	});
	it('should not display a list if no included zones were provided', () => {
		const { container } = render(
			<SimsGeographySelector includes={[]} excludes={[]} />,
		);
		expect(container.querySelector('.row div:nth-child(1) ul')).toBeNull();
	});
	it('should not display a list if no excluded zones were provided', () => {
		const { container } = render(
			<SimsGeographySelector includes={[]} excludes={[]} />,
		);
		expect(container.querySelector('.row div:nth-child(2) ul')).toBeNull();
	});
	it('should display delete button if readOnly=false', () => {
		const includes = [
			{ labelLg1: 'labelLg1', labelLg2: 'labelLg2', value: '1' },
		];
		const excludes = [
			{ labelLg1: 'labelLg1', labelLg2: 'labelLg2', value: '1' },
		];
		const { container } = render(
			<SimsGeographySelector includes={includes} excludes={excludes} />,
		);
		expect(container.querySelectorAll('button')).toHaveLength(2);
	});
});
