import { ComponentProps } from 'react';

export const TextInput = (props: Readonly<ComponentProps<'input'>>) => (
	<input type="text" className="form-control" {...props} />
);

export const UrlInput = (props: Readonly<ComponentProps<'input'>>) => (
	<input type="url" className="form-control" {...props} />
);

export const NumberInput = (props: Readonly<ComponentProps<'input'>>) => (
	<input type="number" className="form-control" {...props} />
);
