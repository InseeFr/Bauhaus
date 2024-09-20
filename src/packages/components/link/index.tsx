import { ComponentProps } from 'react';
import { Link as ReactLink } from 'react-router-dom';

type LinkTypes = {
	disabled?: boolean;
	children: any;
	className?: string;
} & ComponentProps<typeof ReactLink>;

export const Link = ({
	disabled,
	children,
	className,
	...rest
}: LinkTypes) => {
	if (disabled) {
		return <span className={className + ' disabled'}>{children}</span>;
	}
	return (
		<ReactLink className={className} {...rest}>
			{children}
		</ReactLink>
	);
};
