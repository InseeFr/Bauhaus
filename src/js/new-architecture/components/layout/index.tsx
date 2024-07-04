import React, { PropsWithChildren } from 'react';

export const Column = ({ children }: PropsWithChildren<{}>) => {
	return <div className="col-md-6">{children}</div>;
};
