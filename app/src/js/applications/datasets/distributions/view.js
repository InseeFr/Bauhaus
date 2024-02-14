import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../../remote-api/datasets/distributions-api';
import { useSelector } from 'react-redux';
import * as select from '../../../reducers';
import {
	Auth,
	CheckSecondLang,
	DateUtils,
	HTMLUtils,
	PageTitleBlock,
	Stores,
	Row,
} from 'bauhaus-utilities';
import {
	ActionToolbar,
	Button,
	goBack,
	Loading,
	Note,
	ReturnButton,
} from '@inseefr/wilco';
import D, { D1, D2 } from '../../../i18n/build-dictionary';
import React from 'react';

export const DistributionView = (props) => {
	const { id } = useParams();

	const { data: distribution, isLoading } = useQuery({
		queryKey: ['distributions', id],
		queryFn: () => api.getById(id),
	});

	const { lg1, lg2 } = useSelector((state) => select.getLangs(state));
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);

	if (isLoading) return <Loading />;

	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={distribution.labelLg1}
				titleLg2={distribution.labelLg1}
				secondLang={secondLang}
			/>

			<ActionToolbar>
				<ReturnButton action={goBack(props, '/datasets/distributions')} />

				<Auth.AuthGuard roles={[Auth.ADMIN]}>
					<Button
						action={`/datasets/distributions/${distribution.id}/modify`}
						label={D.btnUpdate}
					/>
				</Auth.AuthGuard>
			</ActionToolbar>

			<CheckSecondLang />

			<Row>
				<Note
					text={
						<ul>
							<li>
								{D.createdDateTitle} :{' '}
								{DateUtils.stringToDate(distribution.created)}{' '}
							</li>
							<li>
								{D.modifiedDateTitle} :{' '}
								{DateUtils.stringToDate(distribution.updated)}{' '}
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
					text={HTMLUtils.renderMarkdownElement(distribution.descriptionLg1)}
					title={D1.descriptionTitle}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={HTMLUtils.renderMarkdownElement(distribution.descriptionLg1)}
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
