import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../../remote-api/classifications-api';
import { ActionToolbar, ErrorBloc, goBack, LabelRequired, Loading } from '@inseefr/wilco';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { EditorMarkdown, PageTitleBlock, Row } from 'bauhaus-utilities';
import { Controller, useForm } from 'react-hook-form';
import D, { D1, D2 } from '../../../../i18n/build-dictionary';
import useClassificationItem from '../hook';
import React from 'react';
import { default as ReactSelect } from 'react-select';
import { fetchingPreviousLevels } from '../client';

const titleMapping = {
	definition: 'classificationsDefinition',
	scopeNote: 'classificationsScopeNote',
	coreContentNote: 'classificationsCoreContentNote',
	additionalContentNote: 'classificationsAdditionalContentNote',
	exclusionNote: 'classificationsExclusionNote',
	changeNote: 'classificationsChangeNote'
};

const ClassificationItemEdition = () => {
	const history = useHistory();
	const queryClient = useQueryClient()
	const { classificationId, itemId } = useParams();

	const { register, handleSubmit, formState: { errors }, control } = useForm({
		criteriaMode: 'firstError',
		mode: 'all',
	});

	const { isLoading: isSaving, mutate: save, isSuccess: isSavingSuccess } = useMutation((general) => {
		return api
			.putClassificationItemGeneral(classificationId, itemId, general)
	}, {
		onSuccess: () => {
			queryClient.refetchQueries(['classifications-item', classificationId, itemId]);
		}
	})

	const { isLoading, item } = useClassificationItem(classificationId, itemId, true);

	const { data: previousLevels = [], isLoading: isPreviousLevelsLoading } = useQuery(['classification-parent-levels', classificationId, itemId], () => {
		return fetchingPreviousLevels(classificationId, item.general)
	}, {
		enabled: !!item.general,
	})

	const previousLevelsOptions = previousLevels.map(previousLevel => ({ value: previousLevel.item, label: previousLevel.labelLg1}));
	console.log(previousLevelsOptions);

	if (isLoading || isPreviousLevelsLoading) return <Loading />;

	if (isSaving) return <Loading textType="saving" />;

	if (isSavingSuccess) {
		return <Redirect to={'/classifications/classification/' + classificationId + '/item/' + itemId} />
	}

	const errorMessage = Object.values(errors)?.[0]?.message;
	const { general, notes } = item;

	const formatAndSave = value => {
		value.altLabels = general.altLabels?.map((altLabel) => {
			const newAltLabel = {
				...altLabel
			}
			if (value['altLabelsLg1_' + altLabel.length]) {
				newAltLabel.shortLabelLg1 = value['altLabelsLg1_' + altLabel.length]
			}
			if (value['altLabelsLg2_' + altLabel.length]) {
				newAltLabel.shortLabelLg2 = value['altLabelsLg2_' + altLabel.length]
			}
			return newAltLabel;
		});

		Object.entries(value).forEach(([key]) => {
			if (key.startsWith("altLabelsLg1_") || key.startsWith("altLabelsLg2_")) {
				delete value[key]
			}
		})
		queryClient.setQueriesData(['classifications-item', classificationId, itemId], { })
		save({ ...general, ...notes, ...value })
	}



	const notesGroupByKey = Object.keys(notes).filter(noteKey => noteKey !== 'version').reduce((acc, noteKey) => {
		const prefixNoteKey = noteKey.replace("Lg1", "").replace("Lg2", "").replace("Uri", "").replace("Date", "");
		return {
			...acc,
			[prefixNoteKey]: {
				...(acc[prefixNoteKey] ?? {}),
				[noteKey]: notes[noteKey]
			}
		}
	}, {});

	return (
		<div className='container editor-container'>
			<PageTitleBlock
				titleLg1={general?.prefLabelLg1}
				titleLg2={general?.prefLabelLg2}
				secondLang={true}
			/>

			<form onSubmit={handleSubmit(value => formatAndSave(value))}>
				<ActionToolbar>
					<div className='col-md-2'>
						<button onClick={goBack({ history }, '/classifications')} className='btn wilco-btn btn-lg col-md-12'
										type='button'>
					<span
						className={`glyphicon glyphicon-floppy-remove`}
						aria-hidden='true'
					/>
							<span>{D.btnCancel}</span>
						</button>
					</div>
					<div className='col-md-2'>
						<button
							className='btn wilco-btn btn-lg col-md-12' type='submit'>
					<span
						className={`glyphicon glyphicon-floppy-disk`}
						aria-hidden='true'
					/>
							<span>{D.btnSave}</span>
						</button>
					</div>
				</ActionToolbar>

				<ErrorBloc error={errorMessage} />

				<Row>
					<div className='col-md-6 form-group'>
						<LabelRequired htmlFor='prefLabelLg1'>{D1.title}</LabelRequired>
						<input
							type='text'
							className='form-control'
							id="prefLabelLg1"
							{...register('prefLabelLg1', { required: D.requiredPrefLabel })}
							defaultValue={general.prefLabelLg1}
						/>
					</div>
					<div className='col-md-6 form-group'>
						<LabelRequired htmlFor='prefLabelLg2'>{D2.title}</LabelRequired>
						<input
							type='text'
							className='form-control'
							id="prefLabelLg2"
							{...register('prefLabelLg2', { required: D.requiredPrefLabel })}
							defaultValue={general.prefLabelLg2}
						/>
					</div>
				</Row>
				<Row>
					<div className="form-group col-md-6">
						<label htmlFor="altLabelLg1">{D1.altLabel}</label>
						<input
							type="text"
							className="form-control"
							id="altLabelLg1"
							{...register('altLabelLg1')}
							defaultValue={general.altLabelLg1}
						/>
					</div>
					<div className="form-group col-md-6">
						<label htmlFor="altLabelLg2">{D2.altLabel}</label>
						<input
							type="text"
							className="form-control"
							id="altLabelLg2"
							{...register('altLabelLg2')}
							defaultValue={general.altLabelLg2}
						/>
					</div>
				</Row>
				<Row>

				</Row>
				<div className="form-group">
					<label>{D.classificationsBroaderLevel}</label>
					<Controller
						name="broaderURI"
						control={control}
						defaultValue={general.broaderURI}
						render={({ field: { onChange, value } }) => {
							return <ReactSelect
								value={previousLevelsOptions.find(option => option.value === value)}
								options={previousLevelsOptions}
								onChange={option => onChange(option.value)}
								clearable={false}
							/>
						}}
					/>
				</div>
				{general.altLabels?.map(({ length, shortLabelLg1, shortLabelLg2 }, index) => {
					return (
						<Row key={index}>
							<div className="form-group col-md-6">
								<label htmlFor={'altLabelsLg1_' + length}>{D1.classificationItemAltLabels(length)}</label>
								<input
									type="text"
									className="form-control"
									id={'altLabelsLg1_' + length}
									{...register('altLabelsLg1_' + length, {
										maxLength: {
											value: Number(length),
											message: D1.classificationItemAltError(length)
										}
									})}
									defaultValue={shortLabelLg1}
								/>
							</div>
							{
								<div className="form-group col-md-6">
									<label htmlFor={'altLabelsLg2_' + length}>{D2.classificationItemAltLabels(length)}</label>
									<input
										type="text"
										className="form-control"
										id={'altLabelsLg2_' + length}
										{...register('altLabelsLg2_' + length, {
											maxLength: {
												value: Number(length),
												message: D1.classificationItemAltError(length)
											}
										})}
										defaultValue={shortLabelLg2}
									/>
								</div>
							}
						</Row>
					)
				})}
				{
					Object.entries(notesGroupByKey).map(([key, values], index) => {
						const keyLg1 = `${key}Lg1`;
						const keyLg2 = `${key}Lg2`;
						const keyLg1Uri = `${keyLg1}Uri`;
						const keyLg2Uri = `${keyLg2}Uri`;
						if (!values[keyLg1Uri] && !values[keyLg2Uri]) {
							return null;
						}

						return (
							<Row key={index}>
								<div className="form-group col-md-6">
									{
										values[keyLg1Uri] && (
											<>
												<label htmlFor={keyLg1}>{D1[titleMapping[key]]}</label>
												<Controller
													name={keyLg1}
													control={control}
													defaultValue={values[keyLg1]}
													render={({ field: { onChange, value } }) => {
														return <EditorMarkdown
															text={value}
															handleChange={onChange}
														/>
													}}
												/>
											</>
										)
									}
								</div>
								<div className="form-group col-md-6">
									{
										values[keyLg2Uri] && (
											<>
												<label htmlFor={keyLg2}>{D2[titleMapping[key]]}</label>
												<Controller
													name={keyLg2}
													control={control}
													defaultValue={values[keyLg2]}
													render={({ field: { onChange, value } }) => {
														return <EditorMarkdown
															text={value}
															handleChange={onChange}
														/>
													}}
												/>
											</>
										)
									}
								</div>
							</Row>
						)
					})
				}
			</form>
		</div>
	)
}
export default ClassificationItemEdition;
