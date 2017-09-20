import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../shared/page-title';

function Role({ roles, agents }) {
	return (
		<div className="container">
			<PageTitle title="Gestion des rôles" />
		</div>
	);
}

export default Role;
