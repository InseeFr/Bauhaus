import { ClientSideError, EditorMarkdown, GlobalClientSideErrorBloc, PageTitleBlock, Row } from 'bauhaus-utilities';
import {
	ActionToolbar,
	CancelButton,
	goBack,
	goBackOrReplace,
	LabelRequired,
	Loading,
	SaveButton,
} from '@inseefr/wilco';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../remote-api/distributions-api';
import datasetApi from '../../../remote-api/datasets-api';
import { D1, D2 } from '../../../i18n';
import { default as ReactSelect } from 'react-select';
import D from '../../../i18n/build-dictionary';

export function validate({ idDataset, labelLg1, labelLg2 }) {

	const errorMessages = [];
	if(!idDataset){
		errorMessages.push(D.mandatoryProperty(D1.datasetsTitle))
	}
	if(!labelLg1){
		errorMessages.push(D.mandatoryProperty(D1.title))
	}
	if(!labelLg2){
		errorMessages.push(D.mandatoryProperty(D2.title))
	}
	return {
		fields: {
			labelLg1: !labelLg1 ? D.mandatoryProperty(D1.title) : '',
			labelLg2: !labelLg2 ? D.mandatoryProperty(D2.title) : '',
			idDataset: !idDataset ? D.mandatoryProperty(D1.datasetsTitle) : '',
		},
		errorMessage: errorMessages
	};
}


export const DistributionEdit = (props) => {
	const { id } = useParams();
	const isEditing = !!id;

	const [editingDistribution, setEditingDistribution] = useState({ })
	const [clientSideErrors, setClientSideErrors] = useState({})
	const [submitting, setSubmitting] = useState(false)


	const { data: distribution, status } = useQuery({
		enabled: isEditing,
		queryKey: ["distributions", id],
		queryFn: () => api.getById(id)
	});
	useEffect(() => {
		if (status === 'success') {
			setEditingDistribution(distribution)
		}
	}, [status, distribution]);

	const { data: datasets } = useQuery({
		queryFn: () => datasetApi.getAll(),
		queryKey: ['datasets'],
	});

	const datasetsOptions = datasets?.map(dataset => ({
		value: dataset.id,
		label: dataset.label
	})) ?? [];

	const queryClient = useQueryClient()

	const { isLoading: isSaving, mutate: save } = useMutation((id) => {
		if(isEditing){
			return api.putDistribution(editingDistribution)
		} else {
			return api.postDistribution(editingDistribution);
		}

	}, {
		onSuccess: (id) => {
			if(isEditing){
				queryClient.invalidateQueries(["distributions", id]);
			}

			goBackOrReplace(props, `/datasets/distributions/${id}`, !isEditing)
		}
	})

	if(!distribution && isEditing){
		return <Loading />;
	}
	if(isSaving){
		return <Loading textType="saving" />;
	}

	const onSubmit = () => {
		const clientSideErrors = validate(editingDistribution);
		if(clientSideErrors.errorMessage?.length > 0){
			setSubmitting(true);
			setClientSideErrors(clientSideErrors);
		} else {
			setClientSideErrors({});
			save(editingDistribution)
		}
	}


	return (
		<div className="container editor-container">
			{isEditing && (
				<PageTitleBlock
					titleLg1={distribution.labelLg1}
					titleLg2={distribution.labelLg2}
					secondLang={true}
				/>
			)}

			<ActionToolbar>
				<CancelButton action={goBack(props, '/datasets/distributions')} />
				<SaveButton action={onSubmit} disabled={clientSideErrors.errorMessage?.length > 0} />
			</ActionToolbar>
			{ submitting && clientSideErrors && <GlobalClientSideErrorBloc clientSideErrors={clientSideErrors.errorMessage} D={D}/> }
			<form>
				<Row>
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="idDataset">{D1.datasetsTitle}</LabelRequired>
						<ReactSelect
							placeholder={D1.datasetsTitle}
							value={datasetsOptions.find(
								({ value }) => value === editingDistribution.idDataset
							)}
							options={datasetsOptions}
							onChange={(choice) => {
								setEditingDistribution({ ...editingDistribution, idDataset: choice.value})
							}}
						/>
						<ClientSideError error={clientSideErrors?.fields?.idDataset}></ClientSideError>
					</div>
				</Row>
				<Row>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg1">{D1.title}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="labelLg1"
							value={editingDistribution.labelLg1}
							onChange={(e) => setEditingDistribution({ ...editingDistribution, labelLg1: e.target.value})}
						/>
						<ClientSideError error={clientSideErrors?.fields?.labelLg1}></ClientSideError>
					</div>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg2">{D2.title}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="labelLg2"
							value={editingDistribution.labelLg2}
							onChange={(e) => setEditingDistribution({ ...editingDistribution, labelLg2: e.target.value})}
						/>
						<ClientSideError error={clientSideErrors?.fields?.labelLg2}></ClientSideError>
					</div>
				</Row>
				<Row>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg1">{D1.descriptionTitle}</label>
						<EditorMarkdown
							text={editingDistribution.descriptionLg1}
							handleChange={value => setEditingDistribution({ ...editingDistribution, descriptionLg1: value})}
						/>
					</div>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D2.descriptionTitle}</label>
						<EditorMarkdown
							text={editingDistribution.descriptionLg2}
							handleChange={value => setEditingDistribution({ ...editingDistribution, descriptionLg2: value})}
						/>
					</div>
				</Row>
				<Row>
					<div className="col-md-12 form-group">
						<label htmlFor="format">{D1.formatTitle}</label>
						<input
							type="text"
							className="form-control"
							id="format"
							value={editingDistribution.format}
							onChange={(e) => setEditingDistribution({ ...editingDistribution, format: e.target.value})}
							list="format-list"
						/>
						<datalist id="format-list">
							<option value="CSV"></option>
							<option value="PARQUET"></option>
						</datalist>

					</div>
				</Row>
				<Row>
					<div className="col-md-12 form-group">
						<label htmlFor="taille">{D1.tailleTitle}</label>
						<input
							type="number"
							className="form-control"
							id="taille"
							value={editingDistribution.taille}
							onChange={(e) => setEditingDistribution({ ...editingDistribution, taille: e.target.value})}
						/>
					</div>
				</Row>
				<Row>
					<div className="col-md-12 form-group">
						<label htmlFor="url">{D1.downloadUrlTitle}</label>
						<input
							type="url"
							className="form-control"
							id="url"
							value={editingDistribution.url}
							onChange={(e) => setEditingDistribution({ ...editingDistribution, url: e.target.value})}

						/>
					</div>
				</Row>
			</form>
		</div>
	)
}
