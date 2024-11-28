import { render } from '@testing-library/react';

import { List } from './';

describe('List Component', () => {
	it('renders list items based on provided items array', () => {
		const items = ['item1', 'item2', 'item3'];
		const { getByText } = render(<List items={items} />);

		items.forEach((item) => {
			getByText(item);
		});
	});

	it('renders custom content if getContent is provided', () => {
		const items = [{ name: 'John' }, { name: 'Doe' }];
		const getContent = (item: { name: string }) => `Name: ${item.name}`;
		const { getByText } = render(
			<List items={items} getContent={getContent} />,
		);

		items.forEach((item) => {
			getByText(`Name: ${item.name}`);
		});
	});

	it('renders nothing if items array is empty or undefined', () => {
		const { container } = render(<List items={[]} />);
		expect(container.querySelector('ul')).toBeNull();

		const { container: containerUndefined } = render(
			<List items={undefined as any} />,
		);
		expect(containerUndefined.querySelector('ul')).toBeNull();
	});
});
