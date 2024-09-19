// @ts-ignore
import { PropsWithChildren } from 'react';
import './index.scss';

export const Column = ({ children }: PropsWithChildren<{}>) => {
	return <div className="col-md-6">{children}</div>;
};

export const Row = ({ children, className = '' }: PropsWithChildren<{ className: string}>) => (
	<div className={`row ${className}`}>{children}</div>
);
