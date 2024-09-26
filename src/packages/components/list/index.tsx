import { ReactNode } from 'react';

type ListTypes<T> = {
	items: T[];
	getContent?: (value: T) => string | ReactNode;
	getKey?: (value: T) => string;
};

export const List = <T extends object>({
	items,
	getContent = (value: any) => value.toString(),
	getKey = (value: any) => value.toString(),
}: Readonly<ListTypes<T>>) => {
	if (!items || items.length === 0) {
		return null;
	}
	return (
		<ul>
			{items.map((item) => (
				<li key={getKey(item)}>{getContent(item)}</li>
			))}
		</ul>
	);
};
