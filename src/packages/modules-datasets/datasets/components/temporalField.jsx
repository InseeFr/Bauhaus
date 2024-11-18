import ReactSelect from 'react-select';

import { NumberInput } from '@components/form/input';

import D, { D1 } from '../../../deprecated-locales/build-dictionary';

const datasetsTemporalCoverageOptions = [
	{
		value: 'http://www.w3.org/2001/XMLSchema#gYear',
		label: D.datasetsTemporalTypeYear,
	},
	{
		value: 'http://www.w3.org/2001/XMLSchema#date',
		label: D.datasetsTemporalTypeDate,
	},
];

export const TemporalField = ({
	temporalCoverageStartDate,
	temporalCoverageEndDate,
	temporalCoverageDataType,
	updateTemporalCoverage,
}) => {
	const formatYearTypeValue = (year) => new Date(`${year}-01-01`);
	const getDefaultValueForYearCoverageType = () => {
		return new Date().getFullYear();
	};
	const onTemporalCoverageChange = ({ value }) => {
		if (value?.endsWith('date')) {
			updateTemporalCoverage({
				temporalCoverageStartDate: '',
				temporalCoverageEndDate: '',
				temporalCoverageDataType: value,
			});
		} else {
			updateTemporalCoverage({
				temporalCoverageStartDate: formatYearTypeValue(
					getDefaultValueForYearCoverageType(),
				),
				temporalCoverageEndDate: formatYearTypeValue(
					getDefaultValueForYearCoverageType(),
				),
				temporalCoverageDataType: value,
			});
		}
	};
	return (
		<>
			<div className="col-md-4 form-group">
				<label className="w-100 wilco-label-required">
					{D1.datasetsTemporalCoverage}
					<ReactSelect
						value={temporalCoverageDataType}
						options={datasetsTemporalCoverageOptions}
						clearable={false}
						onChange={onTemporalCoverageChange}
					/>
				</label>
			</div>
			{temporalCoverageDataType?.endsWith('date') && (
				<>
					<div className="col-md-4 form-group">
						<label className="w-100 wilco-label-required">
							{D1.datasetsTemporalStartDate}
							<input
								type="date"
								className="form-control"
								value={temporalCoverageStartDate}
								onChange={(e) => {
									updateTemporalCoverage({
										temporalCoverageStartDate: e.target.value,
										temporalCoverageEndDate,
										temporalCoverageDataType,
									});
								}}
							/>
						</label>
					</div>
					<div className="col-md-4 form-group">
						<label className="w-100 wilco-label-required">
							{D1.datasetsTemporalEndDate}
							<input
								type="date"
								className="form-control"
								value={temporalCoverageEndDate}
								onChange={(e) => {
									updateTemporalCoverage({
										temporalCoverageStartDate,
										temporalCoverageEndDate: e.target.value,
										temporalCoverageDataType,
									});
								}}
							/>
						</label>
					</div>
				</>
			)}
			{temporalCoverageDataType?.endsWith('Year') && (
				<>
					<div className="col-md-4 form-group">
						<label className="w-100 wilco-label-required">
							{D1.datasetsTemporalStartDate}
							<NumberInput
								value={
									temporalCoverageStartDate
										? new Date(temporalCoverageStartDate).getFullYear()
										: getDefaultValueForYearCoverageType()
								}
								onChange={(e) => {
									updateTemporalCoverage({
										temporalCoverageEndDate: formatYearTypeValue(
											e.target.value,
										),
										temporalCoverageDataType,
										temporalCoverageStartDate: formatYearTypeValue(
											e.target.value,
										),
									});
								}}
							/>
						</label>
					</div>
					<div className="col-md-4 form-group">
						<label className="w-100 wilco-label-required">
							{D1.datasetsTemporalEndDate}
							<NumberInput
								value={
									temporalCoverageEndDate
										? new Date(temporalCoverageEndDate).getFullYear()
										: getDefaultValueForYearCoverageType()
								}
								onChange={(e) => {
									updateTemporalCoverage({
										temporalCoverageStartDate: formatYearTypeValue(
											e.target.value,
										),
										temporalCoverageDataType,
										temporalCoverageEndDate: formatYearTypeValue(
											e.target.value,
										),
									});
								}}
							/>
						</label>
					</div>
				</>
			)}
		</>
	);
};
