import React from "react";
import D from '../../i18n/build-dictionary';
import { NavLink } from 'react-router-dom';
import "./newButton.scss";


const AbstractNewButton = ({ action, disabled, children, suffix }) => (
		<NavLink className="new-button btn btn-lg col-md-12" to={action} disabled={disabled}>
			<span className="glyphicon glyphicon-plus" aria-hidden={true}></span>
			{!!suffix ? <span>{children} {suffix}</span> : <span>{children}</span>}
		</NavLink>
)

export const MasculineButton = (props) => <AbstractNewButton {...props}>{D.btnNewMasculine}</AbstractNewButton>
export const FeminineButton = (props) => <AbstractNewButton {...props}>{D.btnNewFeminine}</AbstractNewButton>
