import {
	ComponentProps,
	ComponentPropsWithoutRef,
	PropsWithChildren,
} from 'react';
import { Link as ReactLink } from 'react-router-dom';

type LinkTypes = {
	disabled?: boolean;
	className?: string;
} & ComponentProps<typeof ReactLink>;

export const Link = ({
	disabled,
	children,
	className,
	...rest
}: Readonly<PropsWithChildren<LinkTypes>>) => {
	if (disabled) {
		return <span className={className + ' disabled'}>{children}</span>;
	}
	return (
		<ReactLink className={className} {...rest}>
			{children}
		</ReactLink>
	);
};

export const ExternalLink = ({
	children,
	...props
}: ComponentPropsWithoutRef<'a'>) => {
	return (
		<a target="_blank" rel="noreferrer noopener" {...props}>
			{children}
		</a>
	);
};
