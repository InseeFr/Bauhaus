import React from 'react';
import { TableHeaderColumn } from 'react-bootstrap-table';
import TableRmes from 'js/components/shared/table-rmes';
import del from 'img/del.png';

function DeleteTable({ roles, selectedRole, openModal }) {
	const persons = roles.find(p => p.id === selectedRole).persons.map(p => ({
		...p,
		del: { img: del, id: p.id, label: p.label },
	}));
	const imageFormatter = cell => {
		const { img, ...data } = cell;
		return (
			<img
				src={cell.img}
				alt="delete"
				onClick={() => openModal(data)}
				className="img-flag"
			/>
		);
	};

	const rowsParams = [
		{ dataField: 'label', label: 'Nom', width: '50%', isKey: true },
		{ dataField: 'stamp', label: 'Timbre', width: '40%' },
		{
			dataField: 'del',
			label: '',
			width: '30%',
			dataFormat: imageFormatter,
		},
	];
	const rows = rowsParams.map(
		({ dataField, label, width, isKey, dataFormat }) =>
			<TableHeaderColumn
				key={label}
				width={width}
				dataField={dataField}
				isKey={isKey}
				dataAlign="center"
				dataFormat={dataFormat}
				dataSort={true}
			>
				{label}
			</TableHeaderColumn>
	);

	return <TableRmes data={persons} rows={rows} />;
}

export default DeleteTable;
