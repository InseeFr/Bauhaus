import { PropsWithChildren } from 'react';

import './index.scss';

export const ActionToolbar = ({
	children,
}: Readonly<PropsWithChildren<unknown>>) => (
	<div className="row wilco-action-toolbar">{children}</div>
);
