import './index.scss';
import { ComponentProps, PropsWithChildren } from 'react';

export default ({
	children,
	...props
}: Readonly<PropsWithChildren<ComponentProps<'label'>>>) => {
	return (
		<label {...props} className="label-required">
			{children}
			<span className="asterisk">*</span>
		</label>
	);
};
