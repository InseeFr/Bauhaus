import React from 'react';
import { BootstrapTable } from 'react-bootstrap-table';

function TableRmes({ rows, data }) {
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
				>
					{rows}
				</BootstrapTable>
			</div>
		</div>
	);
}

export default TableRmes;
