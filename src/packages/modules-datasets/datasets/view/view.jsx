import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import D, { D1, D2 } from '../../../deprecated-locales/build-dictionary';
import { CL_PROCESS_STEP } from '../../../redux/actions/constants/codeList';
import { DatasetsApi } from '../../../sdk';
import { withCodesLists } from '../../../utils/hoc/withCodesLists';
import { useTitle } from '../../../utils/hooks/useTitle';
import { renderMarkdownElement } from '../../../utils/html-utils';
import { useDataset } from '../../datasets';
import { ViewMenu } from './menu';

import { CodeDisplay } from '../../../components/code-display';
import { List } from '../../../components/list';
import { Note } from '@components/note';
import { useSecondLang } from '../../../utils/hooks/second-lang';
import { D as DatasetDictionary } from '../../i18n';
import { GlobalInformationBlock } from './GlobalInformationBlock';
import { StatisticalInformations } from './StatisticalInformations';
import { PageTitleBlock } from '@components/page-title-block';
import { Deleting, Loading, Publishing } from '@components/loading';
import { ErrorBloc } from '@components/errors-bloc';
import { CheckSecondLang } from '@components/check-second-lang';
import { Row } from '@components/layout';
import { ContributorsVisualisation } from '@components/contributors/contributors';
import { DisseminationStatusVisualisation } from '@components/dissemination-status/disseminationStatus';

const Dataset = (props) => {
	const [serverSideError, setServerSideError] = useState();
	const { id } = useParams();
	const navigate = useNavigate();
	const [archivageUnits, setArchivageUnits] = useState([]);

	useEffect(() => {
		DatasetsApi.getArchivageUnits().then(setArchivageUnits);
	}, []);

	const { data: dataset, isLoading } = useDataset(id);

	const [secondLang] = useSecondLang();
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
				queryClient.removeQueries(['datasets', id]),
				queryClient.invalidateQueries(['datasets']),
			]).then(() => navigate('/datasets'));
		},
	});

	useTitle(D.datasetsTitle, dataset?.labelLg1);

	if (isLoading) return <Loading />;
	if (isDeleting) return <Deleting />;
	if (isPublishing) return <Publishing />;

	return (
		<div className="container">
			<PageTitleBlock titleLg1={dataset.labelLg1} titleLg2={dataset.labelLg2} />

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
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={dataset.subTitleLg2}
						title={D2.datasetsSubtitle}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<Row>
				<Note
					text={dataset.landingPageLg1}
					title={D1.datasetsLandingPage}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={dataset.landingPageLg2}
						title={D2.datasetsLandingPage}
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
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={renderMarkdownElement(dataset.descriptionLg1)}
						title={D2.descriptionTitle}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<Row>
				<Note
					text={renderMarkdownElement(dataset.abstractLg1)}
					title={D1.datasetsAbstract}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={renderMarkdownElement(dataset.abstractLg2)}
						title={D2.datasetsAbstract}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<Row>
				<Note
					text={renderMarkdownElement(dataset.cautionLg1)}
					title={D1.datasetsCaution}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={renderMarkdownElement(dataset.cautionLg2)}
						title={D2.datasetsCaution}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<StatisticalInformations dataset={dataset}></StatisticalInformations>
		</div>
	);
};

export const Component = withCodesLists([CL_PROCESS_STEP])(Dataset);
