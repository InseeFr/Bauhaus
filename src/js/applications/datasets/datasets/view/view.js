import { Link, useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as select from '../../../../reducers';
import {
	CheckSecondLang,
	DateUtils,
	HTMLUtils,
	PageTitleBlock,
	Stores,
	useTitle,
} from 'js/utils';
import { useEffect, useState } from 'react';
import { Note } from '@inseefr/wilco';
import D, { D1, D2 } from '../../../../i18n/build-dictionary';
import api from '../../api/datasets-api';
import StructureAPI from '../../../structures/apis/structure-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useThemes } from '../useThemes';
import apiOrganisations from '../../../../remote-api/organisations-api';
import { withCodesLists } from '../../../../hooks/hooks';
import { useDataset } from '../../hooks';
import { ViewMenu } from './menu';
import {
	Deleting,
	Publishing,
	Loading,
	Row,
	ConditionalDisplay,
	Organization,
	Organizations,
} from 'js/new-architecture/components';
import { DisseminationStatusVisualisation } from '../../../../utils/dissemination-status/disseminationStatus';
import { ContributorsVisualisation } from '../../../../utils/contributors/contributors';
import { CL_FREQ } from '../../../../actions/constants/codeList';
import {} from '../../../../new-architecture/components/data/creators';

const Dataset = (props) => {
	const { id } = useParams();
	const history = useHistory();
	const { data: structures } = useQuery({
		queryKey: ['structures'],
		queryFn: () => {
			return StructureAPI.getStructures();
		},
	});
	const [archivageUnits, setArchivageUnits] = useState([]);

	useEffect(() => {
		api.getArchivageUnits().then(setArchivageUnits);
	}, []);

	const { data: organisations } = useQuery({
		queryFn: () => {
			return apiOrganisations.getOrganisations();
		},
		queryKey: ['organisations'],
	});

	const { data: dataset, isLoading } = useDataset(id);

	const { data: themesOptions = [] } = useThemes();

	const { lg1, lg2 } = useSelector((state) => select.getLangs(state));
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const queryClient = useQueryClient();

	const { isLoading: isPublishing, mutate: publish } = useMutation(
		() => {
			return api.publish(id);
		},
		{
			onSuccess: (id) => {
				queryClient.invalidateQueries(['datasets', id]);
			},
		}
	);

	const { isLoading: isDeleting, mutate: remove } = useMutation(
		() => {
			return api.deleteDataset(id);
		},
		{
			onSuccess: (id) => {
				return Promise.all([
					queryClient.invalidateQueries(['dataset', id]),
					queryClient.invalidateQueries(['dataset']),
				]).then(() => history.push('/datasets'));
			},
		}
	);

	useTitle(D.datasetsTitle, dataset?.labelLg1);

	if (isLoading) return <Loading />;
	if (isDeleting) return <Deleting />;
	if (isPublishing) return <Publishing />;

	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={dataset.labelLg1}
				titleLg2={dataset.labelLg2}
				secondLang={secondLang}
			/>

			<ViewMenu
				dataset={dataset}
				{...props}
				onPublish={publish}
				onDelete={remove}
			/>
			<CheckSecondLang />

			<Row>
				<Note
					text={
						<ul>
							<li>
								{D.createdDateTitle} :{' '}
								{DateUtils.stringToDate(dataset.catalogRecord?.created)}{' '}
							</li>
							<li>
								{D.modifiedDateTitle} :{' '}
								{DateUtils.stringToDate(dataset.catalogRecord?.updated)}{' '}
							</li>
							<ConditionalDisplay data={dataset?.issued}>
								<li>
									{D.datasetsFirstDiffusion} :{' '}
									{DateUtils.stringToDate(dataset?.issued)}{' '}
								</li>
							</ConditionalDisplay>

							{dataset.accessRights && (
								<li>
									{D.datasetsAccessRights} :{' '}
									{
										props['CL_ACCESS_RIGHTS']?.codes?.find(
											(t) => t.iri === dataset.accessRights
										)?.labelLg1
									}
								</li>
							)}
							{dataset.accrualPeriodicity && (
								<li>
									{D.datasetsUpdateFrequency} :{' '}
									{
										props[CL_FREQ]?.codes?.find(
											(t) => t.iri === dataset.accrualPeriodicity
										)?.labelLg1
									}
								</li>
							)}
							{dataset.confidentialityStatus && (
								<li>
									{D.datasetsConfidentialityStatus} :{' '}
									{
										props['CL_CONF_STATUS']?.codes?.find(
											(t) => t.iri === dataset.confidentialityStatus
										)?.labelLg1
									}
								</li>
							)}
							<ConditionalDisplay data={dataset.creators}>
								<li>
									{D.datasetsDataProvider} :
									<Organizations
										creators={dataset.creators}
										organizations={organisations}
									/>
								</li>
							</ConditionalDisplay>

							{dataset.publisher && (
								<li>
									{D.datasetsPublicationProvider} :{' '}
									<Organization
										creator={dataset.publisher}
										organizations={organisations}
									/>
								</li>
							)}
							<li>
								{D.generatedBy} :{' '}
								<Link to={`/operations/series/${dataset.idSerie}`}>
									{dataset?.serie?.prefLabelLg1}
								</Link>
							</li>
							<ConditionalDisplay data={dataset.themes}>
								<li>
									{D.theme} :
									<ul>
										{dataset.themes.map((theme) => (
											<li key={theme}>
												{themesOptions?.find((t) => t.value === theme)?.label}
											</li>
										))}
									</ul>
								</li>
							</ConditionalDisplay>
						</ul>
					}
					title={D1.globalInformationsTitle}
					alone={true}
				/>
			</Row>

			<Row>
				<Note
					text={dataset.subTitleLg1}
					title={D1.datasetsSubtitle}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={dataset.subTitleLg2}
						title={D2.datasetsSubtitle}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<Row>
				<Note
					text={dataset.landingPageLg1}
					title={D1.datasetsLandingPage}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={dataset.landingPageLg2}
						title={D2.datasetsLandingPage}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<Row>
				<Note
					text={
						<ul>
							<li>
								{D.creatorTitle} : {dataset.catalogRecord?.creator}{' '}
							</li>
							<li>
								<ContributorsVisualisation
									contributors={dataset.catalogRecord?.contributor}
								/>
							</li>

							<li>
								<DisseminationStatusVisualisation
									disseminationStatus={dataset.disseminationStatus}
								/>
							</li>
							{dataset.processStep && (
								<li>
									{D.datasetProcessStep} :{' '}
									{
										props['CL_PROCESS_STEP']?.codes?.find(
											(t) => t.iri === dataset.processStep
										)?.labelLg1
									}
								</li>
							)}
							{dataset.archiveUnit && (
								<li>
									{D.datasetsArchiveUnit} :{' '}
									{
										archivageUnits?.find((t) => t.value === dataset.archiveUnit)
											?.label
									}
								</li>
							)}
						</ul>
					}
					title={D1.internalManagementTitle}
					alone={true}
				/>
			</Row>

			<Row>
				<Note
					text={HTMLUtils.renderMarkdownElement(dataset.descriptionLg1)}
					title={D1.descriptionTitle}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={HTMLUtils.renderMarkdownElement(dataset.descriptionLg1)}
						title={D2.descriptionTitle}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<Row>
				<Note
					text={HTMLUtils.renderMarkdownElement(dataset.abstractLg1)}
					title={D1.datasetsAbstract}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={HTMLUtils.renderMarkdownElement(dataset.abstractLg2)}
						title={D2.datasetsAbstract}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<Row>
				<Note
					text={HTMLUtils.renderMarkdownElement(dataset.cautionLg1)}
					title={D1.datasetsCaution}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={HTMLUtils.renderMarkdownElement(dataset.cautionLg2)}
						title={D2.datasetsCaution}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<Row>
				<Note
					text={
						<ul>
							{dataset.type && (
								<li>
									{D.datasetsType} :{' '}
									{
										props['CL_DATA_TYPES']?.codes?.find(
											(t) => t.iri === dataset.type
										)?.labelLg1
									}
								</li>
							)}
							<ConditionalDisplay data={dataset.statisticalUnit}>
								<li>
									{D.datasetsStatisticalUnits} :{' '}
									{
										<ul>
											{dataset.statisticalUnit.map((unit) => (
												<li>
													{
														props['CL_STAT_UNIT']?.codes?.find(
															(t) => t.iri === unit
														)?.labelLg1
													}
												</li>
											))}
										</ul>
									}
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
									{DateUtils.stringToDate(dataset.temporalCoverageStartDate)}{' '}
									{DateUtils.stringToDate(dataset.temporalCoverageEndDate)}
								</li>
							)}

							{dataset.temporalResolution && (
								<li>
									{D.datasetsTemporalResolution} :{' '}
									{
										props[CL_FREQ]?.codes?.find(
											(t) => t.iri === dataset.temporalResolution
										)?.labelLg1
									}
								</li>
							)}

							{dataset.spacialCoverage && (
								<li>
									{D.datasetsSpacialCoverage} :{' '}
									{
										props['CL_GEO']?.codes?.find(
											(t) => t.iri === dataset.spacialCoverage
										)?.labelLg1
									}
								</li>
							)}
							{dataset.spacialTemporal && (
								<li>
									{D.datasetsSpacialTemporal} :{' '}
									{DateUtils.stringToDate(dataset.spacialTemporal)}
								</li>
							)}

							<ConditionalDisplay data={dataset.spacialResolutions}>
								<li>
									{D.datasetsSpacialResolutions} :{' '}
									<ul>
										{dataset.spacialResolutions?.map((spacialResolution) => {
											return (
												<li>
													{
														props['CL_TYPE_GEO']?.codes?.find(
															(t) => t.iri === spacialResolution
														)?.labelLg1
													}
												</li>
											);
										})}
									</ul>
								</li>
							</ConditionalDisplay>

							{dataset.observationNumber && (
								<li>
									{D.datasetsNumberObservations} : {dataset.observationNumber}
								</li>
							)}
							{dataset.timeSeriesNumber && (
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
		</div>
	);
};

export const DatasetView = withCodesLists([
	'CL_ACCESS_RIGHTS',
	CL_FREQ,
	'CL_CONF_STATUS',
	'CL_DATA_TYPES',
	'CL_STAT_UNIT',
	'CL_PROCESS_STEP',
	'CL_GEO',
	'CL_TYPE_GEO',
])(Dataset);
