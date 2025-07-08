import { Context, useContext } from 'react';

export const makeSafeUseContext = <T>(
	context: Context<T>,
	name: string,
): (() => T) => {
	return (): T => {
		const currContext = useContext(context);
		if (!currContext) {
			throw new Error(`${name}.Provider was not found in tree`);
		}
		return currContext;
	};
};
