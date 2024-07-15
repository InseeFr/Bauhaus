import D from '../i18n';
import { NavLink } from 'react-router-dom';
import './newButton.scss';
import { PropsWithChildren } from 'react';

type AbstractNewButtonTypes = {
	action: (location: any) => any;
	suffix: string;
};
const AbstractNewButton = ({
	action,
	children,
	suffix,
}: PropsWithChildren<AbstractNewButtonTypes>) => (
	<NavLink className="new-button btn btn-lg col-md-12" to={action}>
		<span className="glyphicon glyphicon-plus" aria-hidden={true}></span>
		{!!suffix ? (
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
