import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Note, TableRmes } from 'bauhaus-library';
import D, { D1 } from 'js/i18n';
import { propTypes as associationsPropTypes } from 'js/applications/classifications/utils/correspondence/associations';
import { propTypes as correspondencePropTypes } from 'js/applications/classifications/utils/correspondence/general';
import { sortArray } from 'js/utils/array-utils';

const sortById = sortArray('id');

class HomeAssociations extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		associations: associationsPropTypes.isRequired,
		correspondence: correspondencePropTypes.isRequired,
		secondLang: PropTypes.bool.isRequired,
	};

	render() {
		const { id, associations, correspondence, secondLang } = this.props;
		const {
			firstAltLabelLg1,
			firstAltLabelLg2,
			secondAltLabelLg1,
			secondAltLabelLg2,
		} = correspondence;

		const { sourceLabelLg2, targetLabelLg2 } = associations[0];
		if (secondLang && !sourceLabelLg2 && !targetLabelLg2) return null;

		const data = sortById(associations).map(a => {
			const [idS, idT] = a.id.split('-');
			return {
				source: `${idS} - ${
					secondLang ? a['sourceLabelLg2'] : a['sourceLabelLg1']
				}`,
				target: `${idT} - ${
					secondLang ? a['targetLabelLg2'] : a['targetLabelLg1']
				}`,
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
			<div className="row">
				<Note
					text={
						<TableRmes
							rowParams={rowParams}
							data={data}
							search={true}
							pagination={true}
							onRowClick={row =>
								this.props.history.push(`${id}/association/${row.id}`)
							}
							dataAlign="left"
						/>
					}
					title={D1.associationsTitle}
					alone={true}
					allowEmpty={true}
				/>
			</div>
		);
	}
}

export default withRouter(HomeAssociations);
