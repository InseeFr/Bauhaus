import { useNavigate } from 'react-router-dom';
import D, { D1 } from '../../../deprecated-locales';
import { Row } from '@components/layout';
import { sortArray } from '@utils/array-utils';
import { Note } from '@components/note';
import { DataTable } from '@components/datatable';
import { Column } from 'primereact/column';

const sortById = sortArray('id');

const HomeAssociations = ({
	id,
	associations,
	correspondence,
	secondLang,
}: {
	id: string;
	associations: any;
	correspondence: any;
	secondLang: boolean;
}) => {
	const navigate = useNavigate();
	const {
		firstAltLabelLg1,
		firstAltLabelLg2,
		secondAltLabelLg1,
		secondAltLabelLg2,
	} = correspondence;

	const { sourceLabelLg2, targetLabelLg2 } = associations[0];
	if (secondLang && !sourceLabelLg2 && !targetLabelLg2) return null;

	const data = sortById(associations).map((a: any) => {
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

	return (
		<Row>
			<Note
				text={
					<DataTable
						globalFilterFields={['source', 'target']}
						value={data}
						onRowSelect={(e: any) => {
							navigate(`${id}/association/${e.data.id}`);
						}}
					>
						<Column
							field="source"
							header={`${D.sourceClassificationTitle}${
								sourceLabel && ` : ${sourceLabel}`
							}`}
						></Column>
						<Column
							field="target"
							header={`${D.targetClassificationTitle}${
								sourceLabel && ` : ${targetLabel}`
							}`}
						></Column>
					</DataTable>
				}
				title={D1.associationsTitle}
				alone={true}
				allowEmpty={true}
			/>
		</Row>
	);
};

export default HomeAssociations;
