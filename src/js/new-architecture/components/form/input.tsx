import React, { ComponentProps } from 'react';
export const TextInput = (props: ComponentProps<'input'>) => (
	<input type="text" className="form-control" {...props} />
);
