import React, { useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { Table, NumberResult } from '@inseefr/wilco';
import DatePickerRmes from 'js/applications/shared/date-picker-rmes';
import D from 'js/i18n';
import { rowParams } from './data';
import dayjs from 'dayjs';

const ConceptsCreationsModifications = ({ conceptsData, type }) => {
	const [dateFilter, setDateFilter] = useState();
	const history = useHistory();
	const onRowClick = (event, concept) => {
		history.push(`/concept/${concept.id}`)
	}

	const variable = type === 'creations' ? 'created' : 'modified';
	const typeByLang =
		type === 'creations' ? D.creationsTitle : D.modificationsTitle;

	const data = !dateFilter ? conceptsData : conceptsData.filter(concept => dayjs(concept[variable]).isAfter(dayjs(dateFilter).subtract(1, 'days'))).map(d => ({
		...d,
		validationStatus:
			d.validationStatus === 'true'
				? D.conceptStatusValid
				: D.conceptStatusProvisional,
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
}

export default withRouter(ConceptsCreationsModifications);
