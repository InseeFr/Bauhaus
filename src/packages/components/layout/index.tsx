import { ComponentProps, PropsWithChildren } from 'react';

import './index.scss';

export const Column = ({ children }: PropsWithChildren<unknown>) => {
	return <div className="col-md-6">{children}</div>;
};

export const Row = ({
	children,
	className = '',
	...props
}: PropsWithChildren<ComponentProps<'div'>>) => (
	<div className={`row ${className}`} {...props}>
		{children}
	</div>
);
