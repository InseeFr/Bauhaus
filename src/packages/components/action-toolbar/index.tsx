import './index.scss';
import { PropsWithChildren } from 'react';

export const ActionToolbar = ({
	children,
}: Readonly<PropsWithChildren<{}>>) => (
	<div className="row wilco-action-toolbar">{children}</div>
);
