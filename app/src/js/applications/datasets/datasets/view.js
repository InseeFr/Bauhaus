import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as select from '../../../reducers';
import {
	Auth,
	CheckSecondLang, DateUtils, HTMLUtils,
	PageTitleBlock,
	Stores,
	Row
} from 'bauhaus-utilities';
import React from 'react';
import { ActionToolbar, Button, DSURLToLabel, goBack, Loading, Note, ReturnButton } from '@inseefr/wilco';
import D, { D1, D2 } from '../../../i18n/build-dictionary';
import api from '../../../remote-api/datasets-api';
import operationApi from '../../../remote-api/operations-api';
import { useQuery } from '@tanstack/react-query';

export const DatasetView = (props) => {
	const { id } = useParams();

	const { data: dataset, isLoading } = useQuery({
		queryKey: ["datasets", id],
		queryFn: () => api.getById(id).then((dataset) => {

			if(!!dataset.idSerie){
				return operationApi.getSerie(dataset.idSerie).then(serie => {
					return {
						...dataset,
						serie
					}
				})
			}

			return dataset
		})
	});

	const { data: themesOptions = [] } = useQuery(['themes'], () => {
		return api.getThemes().then(themes => themes.map(theme => ({
			value: theme.uri,
			label: theme.label
		})))
	});

	const { lg1, lg2 } = useSelector(state => select.getLangs(state))
	const secondLang = useSelector(state => Stores.SecondLang.getSecondLang(state))


	if (isLoading) return <Loading />;

	return (
		<div className='container'>
			<PageTitleBlock
				titleLg1={dataset.labelLg1}
				titleLg2={dataset.labelLg2}
				secondLang={secondLang}
			/>

			<ActionToolbar>
				<ReturnButton action={goBack(props, '/datasets')} />

				<Auth.AuthGuard roles={[Auth.ADMIN]}>
					<Button
						action={`/datasets/${dataset.id}/modify`}
						label={D.btnUpdate}
					/>
				</Auth.AuthGuard>
			</ActionToolbar>

			<CheckSecondLang />

			<Row>
			<Note
				text={
					<ul>
						<li>{D.creatorTitle} : { dataset.creator} </li>
						<li>{D.contributorTitle} : { dataset.contributor} </li>
						<li>{D.disseminationStatusTitle} : { DSURLToLabel(dataset.disseminationStatus)} </li>
						<li>{D.theme} : { themesOptions?.find(theme => theme.value === dataset.theme)?.label} </li>
						<li>{D.generatedBy} : <Link to={`/operations/series/${dataset.idSeries}`}>{ dataset?.serie?.prefLabelLg1 }</Link></li>
						<li>{D.createdDateTitle} : { DateUtils.stringToDate(dataset.created) } </li>
						<li>{D.modifiedDateTitle} : { DateUtils.stringToDate(dataset.updated) } </li>

					</ul>
				}
				title={D1.globalInformationsTitle}
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
		</div>
	);
}
