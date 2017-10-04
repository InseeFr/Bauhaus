import React from 'react';
import { BootstrapTable } from 'react-bootstrap-table';

function TableRmes({ rows, data }) {
	const options = {
		sizePerPage: 5,
		noDataText: 'Aucun agent habilité',
		sizePerPageList: [
			{
				text: '5',
				value: 5,
			},
			{
				text: '10',
				value: 10,
			},
			{
				text: 'Tous',
				value: data.length,
			},
		],
	};
	return (
		<div className="row">
			<div className="col-md-10 col-md-offset-1">
				<BootstrapTable
					data={data}
					striped={true}
					hover={true}
					headerStyle={{ background: '#457DBB', color: 'white' }}
					search
					searchPlaceholder="Rechercher dans le tableau"
					pagination
					options={options}
				>
					{rows}
				</BootstrapTable>
			</div>
		</div>
	);
}

export default TableRmes;
