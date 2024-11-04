import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	DateItem,
	DatePicker,
	getDisseminationStatus,
	Row,
} from '../../../../../../components';
import D from '../../../../../../deprecated-locales';
import dayjs from 'dayjs';
import { NumberResults } from '../../../../../../components/number-results';
import { Column } from 'primereact/column';
import { DataTable } from '../../../../../../components/datatable';

const CollectionsCreationsModifications = ({ collectionsData, type }) => {
	const [dateFilter, setDateFilter] = useState();
	const navigate = useNavigate();

	const variable = type === 'creations' ? 'created' : 'modified';
	const typeByLang =
		type === 'creations' ? D.creationsTitle : D.modificationsTitle;

	const data = !dateFilter
		? collectionsData
		: collectionsData
				.filter((concept) =>
					dayjs(concept[variable]).isAfter(
						dayjs(dateFilter).subtract(1, 'days'),
					),
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
			<Row style={{ marginTop: '2%' }}>
				<div className="form-group col-md-4 col-md-offset-4 text-center">
					<label>{D.dashboardConceptsListPickerTitle(typeByLang)}</label>
					<DatePicker
						value={dateFilter}
						onChange={setDateFilter}
						placement="top"
					/>
				</div>
			</Row>
			<div className="row text-center">
				<h4>
					<NumberResults results={data} />
				</h4>
			</div>
			<DataTable
				value={data}
				globalFilterFields={[
					'label',
					'nbMembers',
					'creator',
					type === 'creations' ? 'created' : 'modified',
					'validationStatus',
				]}
				onRowClick={({ data: collection }) =>
					navigate(`/concepts/collections/${collection.id}`)
				}
			>
				<Column field="label" header={D.collectionsTitle}></Column>

				<Column field="nbMembers" header={D.conceptsNumberTitle}></Column>

				<Column
					field="creator"
					header={D.creatorTitle}
					body={(item) => getDisseminationStatus(item.disseminationStatus)}
				></Column>

				<Column
					field="created"
					header={
						type === 'creations' ? D.createdDateTitle : D.modifiedDateTitle
					}
					body={(item) => (
						<DateItem
							date={type === 'creations' ? item.created : item.modified}
						/>
					)}
				></Column>

				<Column
					field="validationStatus"
					header={D.isConceptValidTitle}
				></Column>
			</DataTable>
		</div>
	);
};

export default CollectionsCreationsModifications;
