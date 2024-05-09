import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, NumberResult } from '@inseefr/wilco';
import DatePickerRmes from 'js/applications/shared/date-picker-rmes';
import D from 'js/i18n';
import { rowParams } from './data';
import dayjs from 'dayjs';

const CollectionsCreationsModifications = ({ collectionsData, type }) => {
	const [dateFilter, setDateFilter] = useState();
	const history = useHistory();
	const onRowClick = (_event, collection) =>
		history.push(`/collection/${collection.id}`);

	const variable = type === 'creations' ? 'created' : 'modified';
	const typeByLang =
		type === 'creations' ? D.creationsTitle : D.modificationsTitle;

	const data = !dateFilter
		? collectionsData
		: collectionsData
				.filter((concept) =>
					dayjs(concept[variable]).isAfter(
						dayjs(dateFilter).subtract(1, 'days')
					)
				)
				.map((d) => ({
					...d,
					isValidated:
						d.isValidated === 'true'
							? D.collectionStatusValid
							: D.collectionStatusProvisional,
				}));
	return (
		<div>
			<div className="row" style={{ marginTop: '2%' }}>
				<div className="form-group col-md-4 col-md-offset-4 text-center">
					<label>{D.dashboardConceptsListPickerTitle(typeByLang)}</label>
					<DatePickerRmes
						value={dateFilter}
						onChange={setDateFilter}
						placement="top"
					/>
				</div>
			</div>
			<div className="row text-center">
				<h4>
					<NumberResult results={data} />
				</h4>
			</div>
			<Table
				rowParams={rowParams[type]}
				data={data}
				search={true}
				pagination={true}
				onRowClick={onRowClick}
			/>
		</div>
	);
};

export default CollectionsCreationsModifications;
