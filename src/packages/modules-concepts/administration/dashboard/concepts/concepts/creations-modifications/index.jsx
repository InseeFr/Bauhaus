import { useState } from 'react';
import {
	DateItem,
	DatePicker,
	getDisseminationStatus,
} from '../../../../../../components';
import D from '../../../../../../deprecated-locales';
import dayjs from 'dayjs';
import { NumberResults } from '../../../../../../components/number-results';
import { DataTable } from '../../../../../../components/datatable';
import { Column } from 'primereact/column';
import { Panel } from '../../../../../../components/panel';
import { useNavigate } from 'react-router-dom';

const ConceptsCreationsModifications = ({ conceptsData, type }) => {
	const [dateFilter, setDateFilter] = useState();
	const navigate = useNavigate();

	const variable = type === 'creations' ? 'created' : 'modified';
	const typeByLang =
		type === 'creations' ? D.creationsTitle : D.modificationsTitle;

	const data = !dateFilter
		? conceptsData
		: conceptsData
				.filter((concept) =>
					dayjs(concept[variable]).isAfter(
						dayjs(dateFilter).subtract(1, 'days')
					)
				)
				.map((d) => ({
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
					<DatePicker
						value={dateFilter}
						onChange={setDateFilter}
						placement="top"
					/>
				</div>
			</div>
			<div className="row text-center">
				<h4>
					<NumberResults results={data} />
				</h4>
			</div>

			<Panel>
				<DataTable
					value={data}
					globalFilterFields={[
						'label',
						'creator',
						'disseminationStatus',
						type === 'creations' ? 'created' : 'modified',
						'validationStatus',
					]}
					onRowClick={({ data: concept }) =>
						navigate(`/concepts/${concept.id}`)
					}
				>
					<Column field="label" header={D.conceptsTitle}></Column>

					<Column field="creator" header={D.creatorTitle}></Column>

					<Column
						field="disseminationStatus"
						header={D.disseminationStatusTitle}
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
			</Panel>
		</div>
	);
};

export default ConceptsCreationsModifications;
