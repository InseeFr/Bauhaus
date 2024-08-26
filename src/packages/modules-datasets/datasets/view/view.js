import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { renderMarkdownElement } from '../../../utils/html-utils';
import { useEffect, useState } from 'react';
import { Note } from '@inseefr/wilco';
import D, { D1, D2 } from '../../../deprecated-locales/build-dictionary';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { withCodesLists } from '../../../utils/hoc/withCodesLists';
import { useDataset } from '../../datasets';
import { ViewMenu } from './menu';
import {
	Deleting,
	Publishing,
	Loading,
	Row,
	ContributorsVisualisation,
	DisseminationStatusVisualisation,
	PageTitleBlock,
	CheckSecondLang,
	ErrorBloc,
} from '../../../components';
import { CL_PROCESS_STEP } from '../../../redux/actions/constants/codeList';
import { getLocales } from '../../../redux/selectors';
import { useTitle } from '../../../utils/hooks/useTitle';
import { getSecondLang } from '../../../redux/second-lang';
import { DatasetsApi } from '../../../sdk';

import { D as DatasetDictionary } from '../../i18n';
import { GlobalInformationBlock } from './GlobalInformationBlock';
import { List } from '../../../components/list';
import { CodeDisplay } from '../../../components/code-display';
import { StatisticalInformations } from './StatisticalInformations';

const Dataset = (props) => {
	const [serverSideError, setServerSideError] = useState();
	const { id } = useParams();
	const history = useHistory();

	const [archivageUnits, setArchivageUnits] = useState([]);

	useEffect(() => {
		DatasetsApi.getArchivageUnits().then(setArchivageUnits);
	}, []);

	const { data: dataset, isLoading } = useDataset(id);

	const { lg1, lg2 } = useSelector((state) => getLocales(state));
	const secondLang = useSelector((state) => getSecondLang(state));
	const queryClient = useQueryClient();

	const { isPending: isPublishing, mutate: publish } = useMutation({
		mutationFn: () => {
			return DatasetsApi.publish(id);
		},

		onSuccess: (id) => {
			queryClient.invalidateQueries(['datasets', id]);
		},
	});

	const { isPending: isDeleting, mutate: remove } = useMutation({
		mutationFn: () => {
			return DatasetsApi.deleteDataset(id);
		},
		onError: (error) => {
			setServerSideError(error);
		},
		onSuccess: (id) => {
			return Promise.all([
				queryClient.invalidateQueries(['datasets', id]),
				queryClient.invalidateQueries(['datasets']),
			]).then(() => history.push('/datasets'));
		},
	});

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
			{serverSideError && (
				<ErrorBloc error={[serverSideError]} D={DatasetDictionary} />
			)}

			<CheckSecondLang />

			<GlobalInformationBlock dataset={dataset}></GlobalInformationBlock>

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
						<List
							items={dataset.linkedDocuments}
							getContent={(linkedDocument) => (
								<a href={linkedDocument}>{linkedDocument}</a>
							)}
						></List>
					}
					title={DatasetDictionary.datasets.linkedDocuments}
					lang={lg1}
					alone={true}
					allowEmpty={true}
				></Note>
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
									<CodeDisplay
										codesList={props[CL_PROCESS_STEP]}
										value={dataset.processStep}
									></CodeDisplay>
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
					text={renderMarkdownElement(dataset.descriptionLg1)}
					title={D1.descriptionTitle}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={renderMarkdownElement(dataset.descriptionLg1)}
						title={D2.descriptionTitle}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<Row>
				<Note
					text={renderMarkdownElement(dataset.abstractLg1)}
					title={D1.datasetsAbstract}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={renderMarkdownElement(dataset.abstractLg2)}
						title={D2.datasetsAbstract}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<Row>
				<Note
					text={renderMarkdownElement(dataset.cautionLg1)}
					title={D1.datasetsCaution}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={renderMarkdownElement(dataset.cautionLg2)}
						title={D2.datasetsCaution}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<StatisticalInformations dataset={dataset}></StatisticalInformations>
		</div>
	);
};

export const DatasetView = withCodesLists([CL_PROCESS_STEP])(Dataset);
