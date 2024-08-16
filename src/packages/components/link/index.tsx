import { Link as ReactLink } from 'react-router-dom';

type LinkTypes = {
	to: string;
	disabled?: boolean;
	children: any;
	className?: string;
} & Record<string, any>;
export const Link = ({
	to,
	disabled,
	children,
	className,
	...rest
}: LinkTypes) => {
	if (disabled) {
		return <span className={className + ' disabled'}>{children}</span>;
	}
	return (
		<ReactLink className={className} to={to} {...rest}>
			{children}
		</ReactLink>
	);
};
