import { PropsWithChildren } from 'react';

type ConditionalDisplayTypes = PropsWithChildren<{
	data?: Array<unknown> | string;
}>;

export const ConditionalDisplay = ({
	data,
	children,
}: ConditionalDisplayTypes) => {
	if (data === undefined) {
		return null;
	}

	if (Array.isArray(data)) {
		return data.length === 0 ? null : children;
	}

	return !data ? null : children;
};
