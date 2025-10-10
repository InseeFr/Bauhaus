import { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

import D from '../i18n';
import { AddLogo } from '../logo/logo-add';
import './newButton.css';

interface AbstractNewButtonTypes {
	action: ((location: any) => any) | string;
	suffix?: string;
	component?: 'button' | 'link';
}
const AbstractNewButton = ({
	action,
	children,
	suffix,
	component = 'link',
}: PropsWithChildren<AbstractNewButtonTypes>) => {
	if (component === 'button') {
		return (
			<button
				type="button"
				className="new-button btn btn-lg col-md-12"
				onClick={action as () => void}
			>
				<AddLogo />
				{suffix ? (
					<span>
						{children} {suffix}
					</span>
				) : (
					<span>{children}</span>
				)}
			</button>
		);
	}
	return (
		<NavLink className="new-button btn btn-lg col-md-12" to={action}>
			<AddLogo />
			{suffix ? (
				<span>
					{children} {suffix}
				</span>
			) : (
				<span>{children}</span>
			)}
		</NavLink>
	);
};

export const MasculineButton = (props: AbstractNewButtonTypes) => (
	<AbstractNewButton {...props}>{D.btnNew.masculine}</AbstractNewButton>
);
export const FeminineButton = (props: AbstractNewButtonTypes) => (
	<AbstractNewButton {...props}>{D.btnNew.feminine}</AbstractNewButton>
);
