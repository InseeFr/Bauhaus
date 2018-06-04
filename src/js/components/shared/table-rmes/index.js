import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import D from 'js/i18n';
import './table-rmes.css';

function TableRmes({
	rowParams,
	data,
	search,
	pagination,
	cssClass,
	csvFileName,
	onRowClick,
	dataAlign,
	context,
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
		exportCSVText: D.exportCSV,
		onRowClick: onRowClick,
	};
	dataAlign = dataAlign || 'center';
	context = context || 'concepts';
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
		<div className={`${cssClass} table-${context} marginTop`}>
			<BootstrapTable
				exportCSV={csvFileName}
				csvFileName={csvFileName}
				data={data}
				striped={true}
				hover={true}
				tableBodyClass="hover"
				tableHeaderClass={`table-header-${context}`}
				search={search}
				searchPlaceholder={D.searchTablePlaceholder}
				pagination={pagination}
				options={options}
			>
				{rows}
			</BootstrapTable>
		</div>
	);
}

export default TableRmes;
