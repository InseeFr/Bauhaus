import { D1 } from '../../../../../i18n';
import { useQuery } from '@tanstack/react-query';
import { withCodesLists } from '../../../../../hooks/hooks';
import ReactSelect from 'react-select';
import StructureAPI from '../../../../structures/apis/structure-api';
import { Row } from '../../../../../utils';
import { TemporalField } from '../../components/temporalField';
import { convertCodesListsToSelectOption } from '../../../../../utils/datasets/codelist-to-select-options';
import { CL_FREQ } from '../../../../../actions/constants/codeList';

const StatisticalInformationTab = ({
	editingDataset,
	setEditingDataset,
	...props
}) => {
	const clDataTypes = convertCodesListsToSelectOption(props['CL_DATA_TYPES']);

	const { data: structures } = useQuery({
		queryKey: ['structures'],
		queryFn: () => {
			return StructureAPI.getStructures();
		},
	});
	const structuresOptions =
		structures?.map(({ iri, labelLg1 }) => ({ value: iri, label: labelLg1 })) ??
		[];

	const clStatUnit = convertCodesListsToSelectOption(props['CL_STAT_UNIT']);

	const clFreqOptions = convertCodesListsToSelectOption(props[CL_FREQ]);

	const clGeo = convertCodesListsToSelectOption(props['CL_GEO']);

	const clGeoType = convertCodesListsToSelectOption(props['CL_TYPE_GEO']);

	return (
		<>
			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.datasetsType}
						<ReactSelect
							value={editingDataset.type}
							options={clDataTypes}
							onChange={(option) => {
								setEditingDataset({
									...editingDataset,
									type: option?.value,
								});
							}}
						/>
					</label>
				</div>
			</Row>

			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.datasetsDataStructure}
						<ReactSelect
							value={editingDataset.dataStructure}
							options={structuresOptions}
							onChange={(option) => {
								setEditingDataset({
									...editingDataset,
									dataStructure: option?.value,
								});
							}}
						/>
					</label>
				</div>
			</Row>
			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.datasetsStatisticalUnits}
						<ReactSelect
							value={editingDataset.statisticalUnit}
							multi={true}
							options={clStatUnit}
							onChange={(values) => {
								setEditingDataset({
									...editingDataset,
									statisticalUnit: values.map(({ value }) => value),
								});
							}}
						/>
					</label>
				</div>
			</Row>
			<Row>
				<TemporalField
					temporalCoverageDataType={editingDataset.temporalCoverageDataType}
					temporalCoverageStartDate={editingDataset.temporalCoverageStartDate}
					temporalCoverageEndDate={editingDataset.temporalCoverageEndDate}
					updateTemporalCoverage={(temporalCoverage) => {
						setEditingDataset({
							...editingDataset,
							...temporalCoverage,
						});
					}}
				/>
			</Row>

			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.datasetsTemporalResolution}
						<ReactSelect
							value={editingDataset.temporalResolution}
							options={clFreqOptions}
							onChange={(option) => {
								setEditingDataset({
									...editingDataset,
									temporalResolution: option?.value,
								});
							}}
						/>
					</label>
				</div>
			</Row>

			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.datasetsSpacialCoverage}
						<ReactSelect
							value={editingDataset.spacialCoverage}
							options={clGeo}
							onChange={(option) => {
								setEditingDataset({
									...editingDataset,
									spacialCoverage: option?.value,
								});
							}}
						/>
					</label>
				</div>
			</Row>

			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.datasetsSpacialTemporal}
						<input
							type="date"
							className="form-control"
							value={editingDataset.spacialTemporal}
							onChange={(e) => {
								setEditingDataset({
									...editingDataset,
									spacialTemporal: e.target.value,
								});
							}}
						/>
					</label>
				</div>
			</Row>

			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.datasetsSpacialResolutions}
						<ReactSelect
							value={editingDataset.spacialResolutions}
							options={clGeoType}
							multi={true}
							onChange={(values) => {
								setEditingDataset({
									...editingDataset,
									spacialResolutions: values.map(({ value }) => value),
								});
							}}
						/>
					</label>
				</div>
			</Row>
			<Row>
				<div className="col-md-12 from-group ">
					<label htmlFor="observationNumber">
						{D1.datasetsNumberObservations}
					</label>
					<input
						type="number"
						className="form-control"
						id="observationNumber"
						value={editingDataset.observationNumber}
						onChange={(e) => {
							setEditingDataset({
								...editingDataset,
								observationNumber: e.target.value,
							});
						}}
					/>
				</div>
			</Row>
			<Row>
				<div className="col-md-12 from-group ">
					<label htmlFor="timeSeriesNumber">
						{D1.datasetsNumberTimeSeries}
					</label>
					<input
						type="number"
						className="form-control"
						id="timeSeriesNumber"
						value={editingDataset.timeSeriesNumber}
						onChange={(e) => {
							setEditingDataset({
								...editingDataset,
								timeSeriesNumber: e.target.value,
							});
						}}
					/>
				</div>
			</Row>
		</>
	);
};

export const StatisticalInformation = withCodesLists([
	'CL_DATA_TYPES',
	'CL_STAT_UNIT',
	CL_FREQ,
	'CL_GEO',
	'CL_TYPE_GEO',
])(StatisticalInformationTab);
