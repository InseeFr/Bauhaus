import React from 'react';
import { Link } from 'react-router-dom';
import TableRmes from 'js/components/shared/table-rmes';
import { dictionary } from 'js/utils/dictionary';

function VisualisationTable({ roles, handleDelete, setEdition }) {
	const persons = roles.reduce(function(_, role) {
		role.persons.map(p =>
			_.push({ role: role.label, label: p.label, stamp: p.stamp })
		);
		return _;
	}, []);

	const rowParams = [
		{ dataField: 'role', label: 'Rôle', width: '30%' },
		{ dataField: 'label', label: 'Nom', width: '40%', isKey: true },
		{ dataField: 'stamp', label: 'Timbre', width: '30%' },
	];

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
			<TableRmes
				rowParams={rowParams}
				data={persons}
				cssClass="col-md-10 col-md-offset-1"
			/>
		</div>
	);
}

export default VisualisationTable;
