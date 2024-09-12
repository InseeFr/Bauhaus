// @ts-ignore
import { PropsWithChildren } from 'react';

export const Column = ({ children }: PropsWithChildren<{}>) => {
	return <div className="col-md-6">{children}</div>;
};

export const Row = ({ children }: PropsWithChildren<{}>) => (
	<div className="row">{children}</div>
);
