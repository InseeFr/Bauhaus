import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
	CheckSecondLang,
	Loading,
	PageTitleBlock,
	PublicationFemale,
	Row,
} from '../../../components';
import { Note } from '../../../components/note';
import D, { D1, D2 } from '../../../deprecated-locales/build-dictionary';
import { DistributionApi } from '../../../sdk';
import { stringToDate } from '../../../utils/date-utils';
import { useSecondLang } from '../../../utils/hooks/second-lang';
import { useTitle } from '../../../utils/hooks/useTitle';
import { renderMarkdownElement } from '../../../utils/html-utils';
import { useDataset, useDistribution } from '../../datasets';
import { ViewMenu } from './menu';

export const Component = (props) => {
	const { id } = useParams();
	const navigate = useNavigate();

	const { data: distribution, isLoading } = useDistribution(id);

	const { data: dataset, isLoading: isLoadingDataSet } = useDataset(
		distribution?.idDataset,
	);

	const [secondLang] = useSecondLang();

	const queryClient = useQueryClient();

	const { isPending: isPublishing, mutate: publish } = useMutation({
		mutationFn: () => {
			return DistributionApi.publish(id);
		},

		onSuccess: (id) => {
			queryClient.invalidateQueries(['distributions', id]);
		},
	});

	const { isPending: isDeleting, mutate: remove } = useMutation({
		mutationFn: () => {
			return DistributionApi.deleteDistribution(id);
		},

		onSuccess: (id) => {
			return Promise.all([
				queryClient.removeQueries(['distributions', id]),
				queryClient.invalidateQueries(['distributions']),
			]).then(() => navigate('/datasets/distributions'));
		},
	});

	useTitle(D.distributionsTitle, distribution?.labelLg1);

	if (isLoading || isLoadingDataSet || isDeleting) return <Loading />;
	if (isPublishing) return <Loading text="publishing" />;

	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={distribution.labelLg1}
				titleLg2={distribution.labelLg1}
			/>

			<ViewMenu
				distribution={distribution}
				dataset={dataset}
				onPublish={publish}
				onDelete={remove}
				{...props}
			/>

			<CheckSecondLang />

			<Row>
				<Note
					text={
						<ul>
							<li>
								{D.createdDateTitle} : {stringToDate(distribution.created)}{' '}
							</li>
							<li>
								{D.modifiedDateTitle} : {stringToDate(distribution.updated)}{' '}
							</li>
							<li>
								{D.distributionStatus} :
								<PublicationFemale object={distribution} />
							</li>
							<li>
								{D.formatTitle} : {distribution.format}{' '}
							</li>
							<li>
								{D.tailleTitle} : {distribution.taille}{' '}
							</li>
							<li>
								{D.downloadUrlTitle} :{' '}
								<a
									target="_blank"
									rel="noreferrer noopener"
									href={distribution.url}
								>
									{distribution.url}{' '}
								</a>
							</li>
						</ul>
					}
					title={D1.globalInformationsTitle}
					alone={true}
				/>
			</Row>
			<Row>
				<Note
					text={renderMarkdownElement(distribution.descriptionLg1)}
					title={D1.descriptionTitle}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={renderMarkdownElement(distribution.descriptionLg1)}
						title={D2.descriptionTitle}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
		</div>
	);
};
