import ReactSelect from 'react-select';
import React from 'react';
import D, { D1 } from '../../../../i18n/build-dictionary';

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
	return (
		<>
			<div className="col-md-4 form-group">
				<label className="w-100 wilco-label-required">
					{D1.datasetsTemporalCoverage}
					<ReactSelect
						value={temporalCoverageDataType}
						options={datasetsTemporalCoverageOptions}
						onChange={(option) => {
							updateTemporalCoverage({
								temporalCoverageStartDate,
								temporalCoverageEndDate,
								temporalCoverageDataType: option?.value,
							});
						}}
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
							<input
								type="number"
								className="form-control"
								value={
									temporalCoverageStartDate
										? new Date(temporalCoverageStartDate).getFullYear()
										: new Date().getFullYear()
								}
								onChange={(e) => {
									updateTemporalCoverage({
										temporalCoverageEndDate: e.target.value,
										temporalCoverageDataType,
										temporalCoverageStartDate: new Date(
											`${e.target.value}-01-01`
										),
									});
								}}
							/>
						</label>
					</div>
					<div className="col-md-4 form-group">
						<label className="w-100 wilco-label-required">
							{D1.datasetsTemporalEndDate}
							<input
								type="number"
								className="form-control"
								value={
									temporalCoverageEndDate
										? new Date(temporalCoverageEndDate).getFullYear()
										: new Date().getFullYear()
								}
								onChange={(e) => {
									updateTemporalCoverage({
										temporalCoverageStartDate: e.target.value,
										temporalCoverageDataType,
										temporalCoverageEndDate: new Date(
											`${e.target.value}-01-01`
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
