import React from 'react';
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

	const rowParams = [
		{
			dataField: 'label',
			label: 'Nom',
			width: '50%',
			isKey: true,
			dataSort: true,
		},
		{ dataField: 'stamp', label: 'Timbre', width: '40%', dataSort: true },
		{
			dataField: 'del',
			label: '',
			width: '30%',
			dataFormat: imageFormatter,
			dataSort: false,
		},
	];

	return (
		<TableRmes
			rowParams={rowParams}
			data={persons}
			cssClass="col-md-10 col-md-offset-1"
		/>
	);
}

export default DeleteTable;
