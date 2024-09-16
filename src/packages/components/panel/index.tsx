import { PropsWithChildren } from 'react';
import './index.scss';

export const Panel = ({
	title,
	children,
}: Readonly<PropsWithChildren<{ title: string }>>) => {
	return (
		<div className="card panel">
			<div className="card-header">
				<h3 className="card-title">{title}</h3>
			</div>
			<div className="card-body">{children}</div>
		</div>
	);
};
