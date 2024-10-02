import D from '../i18n';
import { NavLink } from 'react-router-dom';
import './newButton.scss';
import { PropsWithChildren } from 'react';
import { AddLogo } from '../logo/logo-add';

type AbstractNewButtonTypes = {
	action: ((location: any) => any) | string;
	suffix?: string;
};
const AbstractNewButton = ({
	action,
	children,
	suffix,
}: PropsWithChildren<AbstractNewButtonTypes>) => (
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

export const MasculineButton = (props: AbstractNewButtonTypes) => (
	<AbstractNewButton {...props}>{D.btnNew.masculine}</AbstractNewButton>
);
export const FeminineButton = (props: AbstractNewButtonTypes) => (
	<AbstractNewButton {...props}>{D.btnNew.feminine}</AbstractNewButton>
);
