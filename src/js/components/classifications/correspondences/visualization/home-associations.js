import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Panel from 'js/components/shared/panel';
import TableRmes from 'js/components/shared/table-rmes';
import D from 'js/i18n';
import { propTypes as associationsPropTypes } from 'js/utils/classifications/correspondence/associations';
import { propTypes as correspondencePropTypes } from 'js/utils/classifications/correspondence/general';
import { sortArray } from 'js/utils/array-utils';

const sortById = sortArray('id');

class HomeAssociations extends Component {
	render() {
		const { id, associations, correspondence, secondLang } = this.props;
		const {
			firstAltLabelLg1,
			firstAltLabelLg2,
			secondAltLabelLg1,
			secondAltLabelLg2,
		} = correspondence;
		const data = sortById(associations).map(a => {
			const [idS, idT] = a.id.split('-');
			return {
				source: `${idS} - ${a.sourceLabelLg1}`,
				target: `${idT} - ${a.targetLabelLg1}`,
				id: a.id,
			};
		});
		const sourceLabel = secondLang ? firstAltLabelLg2 : firstAltLabelLg1;
		const targetLabel = secondLang ? secondAltLabelLg2 : secondAltLabelLg1;
		const rowParams = [
			{
				dataField: 'source',
				label: `${D.sourceClassificationTitle}${sourceLabel &&
					` : ${sourceLabel}`}`,
				width: '50%',
				isKey: true,
			},
			{
				dataField: 'target',
				label: `${D.targetClassificationTitle}${sourceLabel &&
					` : ${targetLabel}`}`,
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
					dataAlign="left"
				/>
			</Panel>
		);
	}
}

HomeAssociations.propTypes = {
	id: PropTypes.string.isRequired,
	associations: associationsPropTypes.isRequired,
	correspondence: correspondencePropTypes.isRequired,
	secondLang: PropTypes.bool.isRequired,
};

export default withRouter(HomeAssociations);
