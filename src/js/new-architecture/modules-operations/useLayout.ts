import { useState } from 'react';

export enum Status {
	BOTH = 'BOTH',
	SUMMARY = 'SUMMARY',
	CONTENT = 'CONTENT',
}

export const useLayout = (): [
	layoutMode: Status,
	changeLayoutMode: (mode: Status) => void
] => {
	const [layoutMode, setLayoutMode] = useState<Status>(
		(localStorage.getItem('HELP_VIEW') as unknown as Status) || Status.BOTH
	);

	const changeLayoutMode = (status: Status): void => {
		localStorage.setItem('HELP_VIEW', status as unknown as string);
		setLayoutMode(status);
	};

	return [layoutMode, changeLayoutMode];
};
