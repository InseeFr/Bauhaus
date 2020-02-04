import React from 'react';
import {
	TableRmes,
	PageTitle,
	UpdateButton,
	ReturnButton,
	ActionToolbar,
} from 'bauhaus-library';
import D from './build-dictionary';
function VisualisationTable({ roles = [] }) {
	let persons = {};

	for (let i = 0; i < roles.length; i++) {
		roles[i].persons.forEach(p => {
			if (persons[p.id]) {
				persons[p.id].roles += ',' + roles[i].label;
			} else {
				persons[p.id] = {
					...p,
					roles: roles[i].label,
				};
			}
		});
	}
	const data = Object.values(persons);
	const rowParams = [
		{
			dataField: 'label',
			label: D.nameTitle,
			width: '40%',
			isKey: true,
			dataSort: true,
		},
		{ dataField: 'stamp', label: D.stampTitle, width: '30%', dataSort: true },
		{ dataField: 'roles', label: D.roleTitle, width: '30%', dataSort: true },
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
