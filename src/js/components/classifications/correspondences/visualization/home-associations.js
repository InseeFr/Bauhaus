import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Panel from 'js/components/shared/panel';
import TableRmes from 'js/components/shared/table-rmes';
import D from 'js/i18n';
import { propTypes as associationsPropTypes } from 'js/utils/classifications/correspondence/associations';

class HomeAssociations extends Component {
	render() {
		const { id, associations } = this.props;
		const data = associations.map(a => {
			const [idS, idT] = a.id.split('-');
			return {
				source: `${idS} - ${a.sourceLabelLg1}`,
				target: `${idT} - ${a.targetLabelLg1}`,
				id: a.id,
			};
		});
		const rowParams = [
			{
				dataField: 'source',
				label: D.sourceClassificationTitle,
				width: '50%',
				isKey: true,
			},
			{
				dataField: 'target',
				label: D.targetClassificationTitle,
				width: '50%',
			},
		];
		return (
			<Panel title={D.associationsTitle} context="classifications">
				<TableRmes
					rowParams={rowParams}
					data={data}
					search={true}
					pagination={true}
					onRowClick={row =>
						this.props.history.push(`${id}/association/${row.id}`)
					}
					context="classifications"
				/>
			</Panel>
		);
	}
}

HomeAssociations.propTypes = {
	associations: associationsPropTypes.isRequired,
};

export default withRouter(HomeAssociations);
