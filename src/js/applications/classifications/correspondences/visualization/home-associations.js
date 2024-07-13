import { useHistory } from 'react-router-dom';
import { Note, Table } from '@inseefr/wilco';
import D, { D1 } from '../../../../i18n';
import { ArrayUtils, Row } from '../../../../utils';

const sortById = ArrayUtils.sortArray('id');

const HomeAssociations = ({ id, associations, correspondence, secondLang }) => {
	const history = useHistory();
	const {
		firstAltLabelLg1,
		firstAltLabelLg2,
		secondAltLabelLg1,
		secondAltLabelLg2,
	} = correspondence;

	const { sourceLabelLg2, targetLabelLg2 } = associations[0];
	if (secondLang && !sourceLabelLg2 && !targetLabelLg2) return null;

	const data = sortById(associations).map((a) => {
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
			text: `${D.sourceClassificationTitle}${
				sourceLabel && ` : ${sourceLabel}`
			}`,
			width: '50%',
			isKey: true,
		},
		{
			dataField: 'target',
			text: `${D.targetClassificationTitle}${
				sourceLabel && ` : ${targetLabel}`
			}`,
			width: '50%',
		},
	];
	return (
		<Row>
			<Note
				text={
					<Table
						rowParams={rowParams}
						data={data}
						search={true}
						pagination={true}
						onRowClick={(_, row) => history.push(`${id}/association/${row.id}`)}
						align="left"
					/>
				}
				title={D1.associationsTitle}
				alone={true}
				allowEmpty={true}
			/>
		</Row>
	);
};

export default HomeAssociations;
