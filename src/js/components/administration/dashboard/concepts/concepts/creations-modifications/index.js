import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import TableRmes from 'js/components/shared/table-rmes';
import DatePickerRmes from 'js/components/shared/date-picker-rmes';
import { rowParams } from './data';
import { filterKeyDate, nbResults } from 'js/utils/array-utils';

class ConceptsCreationsModifications extends Component {
	constructor(props) {
		super();
		this.state = { dateStart: '', redirect: '' };
		this.changeDateCreatedStart = dateStart => this.setState({ dateStart });
		this.onRowClick = concept =>
			this.setState({ redirect: `/concept/${concept.id}` });
	}

	render() {
		const { dateStart, redirect } = this.state;
		const { conceptsData, type } = this.props;

		if (redirect) return <Redirect to={redirect} />;

		const variable = type === 'creations' ? 'created' : 'modified';
		const filterCreatedDate = filterKeyDate(variable);
		const data = conceptsData.filter(filterCreatedDate(dateStart));
		return (
			<div>
				<div className="row" style={{ marginTop: '2%' }}>
					<div className="form-group col-md-4 col-md-offset-4 centered">
						<label>Liste des {type} de concepts depuis le :</label>
						<DatePickerRmes
							value={dateStart}
							onChange={this.changeDateCreatedStart}
							placement="top"
						/>
					</div>
				</div>
				<div className="row centered">
					<h4>{nbResults(data)}</h4>
				</div>
				<TableRmes
					rowParams={rowParams[type]}
					data={data}
					search={true}
					pagination={true}
					onRowClick={this.onRowClick}
				/>
			</div>
		);
	}
}

export default ConceptsCreationsModifications;
