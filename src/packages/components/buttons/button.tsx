import { Link as ReactLink } from 'react-router-dom';

import './button.scss';
import { PropsWithChildren } from 'react';

const DEFAULT_CLASSES: string[] = [];

export const Link = ({ to, disabled, children, className, ...rest }) => {
	if (disabled) {
		return <span className={className + ' disabled'}>{children}</span>;
	}
	return (
		<ReactLink className={className} to={to} {...rest}>
			{children}
		</ReactLink>
	);
};

type ButtonTypes = {
	action: string;
	label?: string;
	disabled?: boolean;
	wrapper?: boolean;
	classes?: string[];
	externalLink?: boolean;
};
export const Button = ({
	action,
	label,
	disabled,
	children,
	wrapper = true,
	classes = DEFAULT_CLASSES,
	externalLink,
	...rest
}: Readonly<PropsWithChildren<ButtonTypes>>) => {
	const content = label ? label : children;
	const className = `btn bauhaus-btn btn-lg col-md-12 ${classes.join(' ')}`;
	let button;
	if (typeof action === 'string') {
		if (externalLink) {
			button = (
				<a
					className={className}
					href={action}
					rel="noopener noreferrer"
					target="_blank"
				>
					{content}
				</a>
			);
		} else {
			button = (
				<Link className={className} to={action} disabled={disabled}>
					{content}
				</Link>
			);
		}
	} else {
		//if action is a function, it means a handler was passed in instead of an URL
		button = (
			<button
				className={className}
				onClick={action}
				disabled={disabled}
				{...rest}
			>
				{content}
			</button>
		);
	}
	if (!wrapper) {
		return button;
	}

	return button;
};
