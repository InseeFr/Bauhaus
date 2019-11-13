import React from 'react';
import { PageTitle, Button } from 'bauhaus-library';
import TableRmes from 'js/components/shared/table-rmes';
import D from 'js/i18n';

function VisualisationTable({ roles = [] }) {
	const persons = roles.reduce(function(_, role) {
		role.persons.map(p =>
			_.push({ role: role.label, label: p.label, stamp: p.stamp })
		);
		return _;
	}, []);

	const rowParams = [
		{ dataField: 'role', label: D.roleTitle, width: '30%', dataSort: true },
		{
			dataField: 'label',
			label: D.nameTitle,
			width: '40%',
			isKey: true,
			dataSort: true,
		},
		{ dataField: 'stamp', label: D.stampTitle, width: '30%', dataSort: true },
	];

	return (
		<div className="container">
			<PageTitle title={D.authorizationTitle} />
			<div className="row btn-line">
				<Button label={D.btnReturn} action="/" />
				<Button
					label={D.btnUpdate}
					action="/administration/roles/update"
					offset={8}
				/>
			</div>
			<TableRmes
				rowParams={rowParams}
				data={persons}
				search={true}
				pagination={true}
				cssClass="col-md-10 col-md-offset-1"
			/>
		</div>
	);
}

export default VisualisationTable;
