import { ComponentProps } from 'react';
export const TextInput = (props: Readonly<ComponentProps<'input'>>) => (
	<input type="text" className="form-control" {...props} />
);
