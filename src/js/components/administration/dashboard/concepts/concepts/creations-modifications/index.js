import React, { Component } from 'react';
import TableRmes from 'js/components/shared/table-rmes';
import DatePickerRmes from 'js/components/shared/date-picker-rmes';
import { rowParams } from './data';
import { filterKeyDate } from 'js/utils/array-utils';

class ConceptsCreationsModifications extends Component {
	constructor(props) {
		super();
		this.state = { dateStart: '' };
		this.changeDateCreatedStart = dateStart => this.setState({ dateStart });
	}

	render() {
		const { dateStart } = this.state;
		const { conceptsData, type } = this.props;
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
				<TableRmes
					rowParams={rowParams[type]}
					data={data}
					search={true}
					pagination={true}
				/>
			</div>
		);
	}
}

export default ConceptsCreationsModifications;
