import React, { useState } from 'react';
import {
	TableRmes,
	PageTitle,
	UpdateButton,
	ReturnButton,
	ActionToolbar,
} from '@inseefr/wilco';
import D from './build-dictionary';

function RolesPicker({ roles = [], person = {}, defaultOpen = false }) {
	const [open, setOpen] = useState(defaultOpen);
	return (
		<div className={`btn-group ${open ? 'open' : ''}`}>
			<button
				type="button"
				className="btn btn-default dropdown-toggle"
				data-toggle="dropdown"
				aria-haspopup="true"
				aria-expanded="false"
				onClick={() => setOpen(!open)}
			>
				Action <span className="caret"></span>
			</button>
			<ul className="dropdown-menu">
				{roles.map(role => (
					<li>
						<input
							type="checkbox"
							checked={person.roles.includes(role.label)}
						/>
						{role.label}
					</li>
				))}

				<li role="separator" className="divider"></li>
				<li>
					<a href="#">Separated link</a>
				</li>
			</ul>
		</div>
	);
}

function VisualisationTable({ roles = [] }) {
	let persons = {};

	for (let i = 0; i < roles.length; i++) {
		roles[i].persons.forEach(p => {
			if (persons[p.id]) {
				persons[p.id].roles += ',' + roles[i].label;
				//persons[p.id].roles.push(roles[i].label);
			} else {
				persons[p.id] = {
					...p,
					roles: roles[i].label,
				};
			}
		});
	}

	const data = Object.values(persons).map(person => ({
		...person,
		//roles: <RolesPicker roles={roles} person={person}></RolesPicker>,
	}));
	const rowParams = [
		{
			dataField: 'label',
			text: D.nameTitle,
			width: '40%',
			sort: true,
		},
		{ dataField: 'stamp', text: D.stampTitle, width: '30%', sort: true },
		{ dataField: 'roles', text: D.roleTitle, width: '30%', sort: true },
	];

	return (
		<div className="container">
			<PageTitle title={D.authorizationTitle} />
			<ActionToolbar>
				<ReturnButton action="/" />
				<UpdateButton action="/habilitation/update" />
			</ActionToolbar>
			<TableRmes
				rowParams={rowParams}
				data={data}
				search={true}
				pagination={true}
			/>
		</div>
	);
}

export default VisualisationTable;
