import { PropsWithChildren } from 'react';

export const ActionToolbar = ({
	children,
}: Readonly<PropsWithChildren<unknown>>) => (
	<div className="row wilco-action-toolbar">{children}</div>
);
