import React, { Fragment } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './table-rmes.scss';
import D from '../build-dictionary';

function TableRmes({
	rowParams,
	data,
	search,
	pagination,
	cssClass,
	onRowClick,
	dataAlign,
}) {
	const options = {
		sizePerPage: 5,
		noDataText: D.noDataTitle,
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
				text: D.allTitle,
				value: data.length,
			},
		],
		onRowClick: onRowClick,
	};
	dataAlign = dataAlign || 'center';
	const rows = rowParams.map(
		({ dataField, label, width, isKey, dataFormat, dataSort }) => (
			<TableHeaderColumn
				key={label}
				width={width}
				dataField={dataField}
				isKey={isKey}
				dataAlign={dataAlign}
				dataFormat={dataFormat}
				dataSort={dataSort}
			>
				{label}
			</TableHeaderColumn>
		)
	);
	return (
		<Fragment>
			<div className={`${cssClass} bauhaus-table pagination marginTop`}>
				<BootstrapTable
					data={data}
					striped={true}
					hover={true}
					tableBodyClass="hover"
					tableHeaderClass={`bauhaus-table-header`}
					search={search}
					searchPlaceholder={D.searchTablePlaceholder}
					pagination={pagination}
					options={options}
				>
					{rows}
				</BootstrapTable>
			</div>
		</Fragment>
	);
}

export default TableRmes;
