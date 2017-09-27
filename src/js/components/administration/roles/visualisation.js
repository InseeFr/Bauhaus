import React from 'react';
import { Link } from 'react-router-dom';
import TableRmes from 'js/components/shared/table-rmes';
import { TableHeaderColumn } from 'react-bootstrap-table';
import { dictionary } from 'js/utils/dictionary';

function VisualisationTable({ roles, handleDelete, setEdition }) {
	const persons = roles.reduce(function(_, role) {
		role.persons.map(p =>
			_.push({ role: role.label, label: p.label, stamp: p.stamp })
		);
		return _;
	}, []);

	const rowsParams = [
		{ dataField: 'role', label: 'Rôle', width: '30%' },
		{ dataField: 'label', label: 'Nom', width: '40%', isKey: true },
		{ dataField: 'stamp', label: 'Timbre', width: '30%' },
	];
	const rows = rowsParams.map(({ dataField, label, width, isKey }) =>
		<TableHeaderColumn
			key={label}
			width={width}
			dataField={dataField}
			isKey={isKey}
			dataAlign="center"
			dataSort={true}
		>
			{label}
		</TableHeaderColumn>
	);

	return (
		<div>
			<div className="row btn-line">
				<div className="col-md-2">
					<Link
						to={`/administration`}
						className="btn btn-primary btn-lg col-md-12"
					>
						{dictionary.buttons.return}
					</Link>
				</div>
				<div className="col-md-2 pull-right">
					<div
						className="btn btn-primary btn-lg col-md-12"
						onClick={() => setEdition(true)}
					>
						{dictionary.buttons.modify}
					</div>
				</div>
			</div>
			<TableRmes data={persons} rows={rows} />
		</div>
	);
}

export default VisualisationTable;
