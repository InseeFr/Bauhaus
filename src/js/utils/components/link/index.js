import { Link as ReactLink } from 'react-router-dom';

const Link = ({ to, disabled, children, className, ...rest }) => {
	if (disabled) {
		return <span className={className + ' disabled'}>{children}</span>;
	}
	return (
		<ReactLink className={className} to={to} {...rest}>
			{children}
		</ReactLink>
	);
};

export default Link;
