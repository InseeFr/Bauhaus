import D, { D1 } from '../../../deprecated-locales/build-dictionary';
import { CodeDisplay } from '../../../components/code-display';
import {
	CL_DATA_TYPES,
	CL_FREQ,
	CL_GEO,
	CL_STAT_UNIT,
	CL_TYPE_GEO,
} from '../../../redux/actions/constants/codeList';
import { ConditionalDisplay, Row } from '../../../components';
import { stringToDate } from '../../../utils/date-utils';
import { Dataset } from '../../../model/Dataset';
import { useCodesList } from '../../../utils/hooks/codeslist';
import { useStructures } from '../../../utils/hooks/structures';
import { Note } from '../../../components/note';

type StatisticalInformationsTypes = {
	dataset: Dataset;
};

export const StatisticalInformations = ({
	dataset,
}: Readonly<StatisticalInformationsTypes>) => {
	const clDataTypes = useCodesList(CL_DATA_TYPES);
	const clStatUnit = useCodesList(CL_STAT_UNIT);
	const clTypeGeo = useCodesList(CL_TYPE_GEO);
	const clGeo = useCodesList(CL_GEO);
	const clFreq = useCodesList(CL_FREQ);

	const { data: structures } = useStructures();

	return (
		<Row>
			<Note
				text={
					<ul>
						{dataset.type && (
							<li>
								{D.datasetsType} :{' '}
								<CodeDisplay
									codesList={clDataTypes}
									value={dataset.type}
								></CodeDisplay>
							</li>
						)}
						<ConditionalDisplay data={dataset.statisticalUnit}>
							<li>
								{D.datasetsStatisticalUnits} :{' '}
								<ul>
									{dataset.statisticalUnit.map((unit) => (
										<li>
											<CodeDisplay
												codesList={clStatUnit}
												value={unit}
											></CodeDisplay>
										</li>
									))}
								</ul>
							</li>
						</ConditionalDisplay>
						{dataset.dataStructure && (
							<li>
								{D.datasetsDataStructure} :{' '}
								{
									structures?.find((t) => dataset.dataStructure === t.iri)
										?.labelLg1
								}
							</li>
						)}
						{dataset.temporalCoverageDataType && (
							<li>
								{D.datasetsTemporalCoverage} :{' '}
								{stringToDate(dataset.temporalCoverageStartDate)}{' '}
								{stringToDate(dataset.temporalCoverageEndDate)}
							</li>
						)}

						{dataset.temporalResolution && (
							<li>
								{D.datasetsTemporalResolution} :{' '}
								<CodeDisplay
									codesList={clFreq}
									value={dataset.temporalResolution}
								></CodeDisplay>
							</li>
						)}

						{dataset.spacialCoverage && (
							<li>
								{D.datasetsSpacialCoverage} :{' '}
								<CodeDisplay
									codesList={clGeo}
									value={dataset.spacialCoverage}
								></CodeDisplay>
							</li>
						)}
						{dataset.spacialTemporal && (
							<li>
								{D.datasetsSpacialTemporal} :{' '}
								{stringToDate(dataset.spacialTemporal)}
							</li>
						)}

						<ConditionalDisplay data={dataset.spacialResolutions}>
							<li>
								{D.datasetsSpacialResolutions} :{' '}
								<ul>
									{dataset.spacialResolutions?.map((spacialResolution) => {
										return (
											<li>
												<CodeDisplay
													codesList={clTypeGeo}
													value={spacialResolution}
												></CodeDisplay>
											</li>
										);
									})}
								</ul>
							</li>
						</ConditionalDisplay>

						{dataset.observationNumber > 0 && (
							<li>
								{D.datasetsNumberObservations} : {dataset.observationNumber}
							</li>
						)}
						{dataset.timeSeriesNumber > 0 && (
							<li>
								{D.datasetsNumberTimeSeries} : {dataset.timeSeriesNumber}
							</li>
						)}
					</ul>
				}
				title={D1.statisticalInformation}
				alone={true}
			/>
		</Row>
	);
};
