import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CheckSecondLang } from '../../../../utils';
import {
	Loading,
	Row,
	PageTitleBlock,
} from '../../../../new-architecture/components';
import { renderMarkdownElement } from '../../../../new-architecture/utils/html-utils';
import { Note } from '@inseefr/wilco';
import D, { D1, D2 } from '../../../../i18n/build-dictionary';
import { useDataset, useDistribution } from '../../hooks';
import { ViewMenu } from './menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import distributionApi from '../../api/distributions-api';
import { getLocales } from '../../../../new-architecture/redux/selectors';
import { useTitle } from '../../../../new-architecture/utils/hooks/useTitle';
import { stringToDate } from '../../../../new-architecture/utils/date-utils';
import { getSecondLang } from '../../../../new-architecture/redux/second-lang';

export const DistributionView = (props) => {
	const { id } = useParams();
	const history = useHistory();

	const { data: distribution, isLoading } = useDistribution(id);

	const { data: dataset, isLoading: isLoadingDataSet } = useDataset(
		distribution?.idDataset
	);

	const { lg1, lg2 } = useSelector((state) => getLocales(state));
	const secondLang = useSelector((state) => getSecondLang(state));

	const queryClient = useQueryClient();

	const { isLoading: isPublishing, mutate: publish } = useMutation({
		mutationFn: () => {
			return distributionApi.publish(id);
		},

		onSuccess: (id) => {
			queryClient.invalidateQueries(['distributions', id]);
		},
	});

	const { isLoading: isDeleting, mutate: remove } = useMutation({
		mutationFn: () => {
			return distributionApi.deleteDistribution(id);
		},

		onSuccess: (id) => {
			return Promise.all([
				queryClient.invalidateQueries(['distributions', id]),
				queryClient.invalidateQueries(['distributions']),
			]).then(() => history.push('/datasets/distributions'));
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
				secondLang={secondLang}
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
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={renderMarkdownElement(distribution.descriptionLg1)}
						title={D2.descriptionTitle}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
		</div>
	);
};
