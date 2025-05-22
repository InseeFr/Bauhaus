import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { ClientSideError, ErrorBloc } from '@components/errors-bloc';
import { TextInput } from '@components/form/input';
import LabelRequired from '@components/label-required';
import { Row } from '@components/layout';
import { Loading, Saving } from '@components/loading';
import { PageTitleBlock } from '@components/page-title-block';
import { EditorMarkdown } from '@components/rich-editor/editor-markdown';
import { Select } from '@components/select-rmes';

import { ClassificationsApi } from '@sdk/classification';

import D, { D1, D2 } from '../../../deprecated-locales/build-dictionary';
import { fetchingPreviousLevels } from '../client';
import useClassificationItem, { useClassificationParentLevels } from '../hook';
import { Menu } from './menu';
import { validate } from './validate';

const titleMapping = {
	definition: 'classificationsDefinition',
	scopeNote: 'classificationsScopeNote',
	coreContentNote: 'classificationsCoreContentNote',
	additionalContentNote: 'classificationsAdditionalContentNote',
	exclusionNote: 'classificationsExclusionNote',
	changeNote: 'classificationsChangeNote',
};

export const Component = () => {
	const queryClient = useQueryClient();
	const { classificationId, itemId } = useParams();

	const {
		isLoading: isSaving,
		mutate: save,
		isSuccess: isSavingSuccess,
	} = useMutation({
		mutationFn: (general) => {
			return ClassificationsApi.putClassificationItemGeneral(
				classificationId,
				itemId,
				general,
			);
		},

		onSuccess: () => {
			queryClient.refetchQueries([
				'classifications-item',
				classificationId,
				itemId,
			]);
		},
	});

	const { isLoading, item } = useClassificationItem(
		classificationId,
		itemId,
		true,
	);

	const { data: previousLevels = [], isPending: isPreviousLevelsLoading } =
		useClassificationParentLevels(classificationId, itemId, item);

	const previousLevelsOptions = previousLevels.map((previousLevel) => ({
		value: previousLevel.item,
		label: previousLevel.labelLg1,
	}));

	const [value, setValue] = useState(item);
	const [clientSideErrors, setClientSideErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	if (isLoading || isPreviousLevelsLoading) return <Loading />;

	if (isSaving) return <Saving />;

	const { general, notes } = value;

	const formatAndSave = (value) => {
		value.altLabels = general.altLabels?.map((altLabel) => {
			const newAltLabel = {
				...altLabel,
			};
			if (value['altLabelsLg1_' + altLabel.length]) {
				newAltLabel.shortLabelLg1 = value['altLabelsLg1_' + altLabel.length];
			}
			if (value['altLabelsLg2_' + altLabel.length]) {
				newAltLabel.shortLabelLg2 = value['altLabelsLg2_' + altLabel.length];
			}
			return newAltLabel;
		});

		Object.entries(value).forEach(([key]) => {
			if (key.startsWith('altLabelsLg1_') || key.startsWith('altLabelsLg2_')) {
				delete value[key];
			}
		});
		queryClient.setQueriesData(
			['classifications-item', classificationId, itemId],
			{},
		);
		save({ ...general, ...notes, ...value });
	};

	const notesGroupByKey = Object.keys(notes)
		.filter((noteKey) => noteKey !== 'version')
		.reduce((acc, noteKey) => {
			const prefixNoteKey = noteKey
				.replace('Lg1', '')
				.replace('Lg2', '')
				.replace('Uri', '')
				.replace('Date', '');
			return {
				...acc,
				[prefixNoteKey]: {
					...(acc[prefixNoteKey] ?? {}),
					[noteKey]: notes[noteKey],
				},
			};
		}, {});

	const onSubmit = () => {
		const clientSideErrors = validate(
			value.general,
			value.general.altLabels.length,
		);
		if (clientSideErrors.errorMessage?.length > 0) {
			setSubmitting(true);
			setClientSideErrors(clientSideErrors);
		} else {
			setClientSideErrors({});
			formatAndSave(value);
		}
	};

	if (isSavingSuccess) {
		return (
			<Navigate
				to={
					'/classifications/classification/' +
					classificationId +
					'/item/' +
					itemId
				}
				replace
			/>
		);
	}

	if (!value?.general) {
		return;
	}

	return (
		<div className="container editor-container">
			<PageTitleBlock
				titleLg1={general?.prefLabelLg1}
				titleLg2={general?.prefLabelLg2}
			/>
			<form onSubmit={onSubmit}>
				<Menu disabled={clientSideErrors.errorMessage?.length > 0} />
				{submitting && clientSideErrors && (
					<ErrorBloc error={clientSideErrors.errorMessage} />
				)}
				<Row>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="prefLabelLg1">{D1.title}</LabelRequired>
						<TextInput
							id="prefLabelLg1"
							value={general.prefLabelLg1}
							onChange={(e) => {
								setValue({
									...value,
									general: { ...value.general, prefLabelLg1: e.target.value },
								});
								setClientSideErrors((clientSideErrors) => ({
									...clientSideErrors,
									errorMessage: [],
								}));
							}}
						/>
						<ClientSideError
							id="prefLabelLg1-error"
							error={clientSideErrors?.fields?.prefLabelLg1}
						></ClientSideError>
					</div>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="prefLabelLg2">{D2.title}</LabelRequired>
						<TextInput
							id="prefLabelLg2"
							value={general.prefLabelLg2}
							onChange={(e) => {
								setValue({
									...value,
									general: { ...value.general, prefLabelLg2: e.target.value },
								});
								setClientSideErrors((clientSideErrors) => ({
									...clientSideErrors,
									errorMessage: [],
								}));
							}}
						/>
						<ClientSideError
							id="prefLabelLg2-error"
							error={clientSideErrors?.fields?.prefLabelLg2}
						></ClientSideError>
					</div>
				</Row>
				<Row>
					<div className="form-group col-md-6">
						<label htmlFor="altLabelLg1">{D1.altLabel}</label>
						<TextInput
							id="altLabelLg1"
							value={general.altLabelLg1}
							onChange={(e) =>
								setValue({
									...value,
									general: { ...value.general, altLabelLg1: e.target.value },
								})
							}
						/>
					</div>
					<div className="form-group col-md-6">
						<label htmlFor="altLabelLg2">{D2.altLabel}</label>
						<TextInput
							id="altLabelLg2"
							value={general.altLabelLg2}
							onChange={(e) =>
								setValue({
									...value,
									general: { ...value.general, altLabelLg2: e.target.value },
								})
							}
						/>
					</div>
				</Row>
				<div className="form-group">
					<label>{D.classificationsBroaderLevel}</label>
					<Select
						value={general.broaderURI}
						options={previousLevelsOptions}
						onChange={(v) =>
							setValue({
								...value,
								general: { ...value.general, broaderURI: v },
							})
						}
						clearable={false}
					/>
				</div>
				{general.altLabels?.map(
					({ length, shortLabelLg1, shortLabelLg2 }, index) => {
						return (
							<Row key={index}>
								<div className="form-group col-md-6">
									<label htmlFor={'altLabelsLg1_' + length}>
										{D1.classificationItemAltLabels(length)}
									</label>
									<TextInput
										id={'altLabelsLg1_' + length}
										value={shortLabelLg1}
										onChange={(e) =>
											setValue({
												...value,
												general: {
													...value.general,
													altLabelsLg1_: e.target.value,
												},
											})
										}
									/>
								</div>
								<div className="form-group col-md-6">
									<label htmlFor={'altLabelsLg2_' + length}>
										{D2.classificationItemAltLabels(length)}
									</label>
									<TextInput
										id={'altLabelsLg2_' + length}
										value={shortLabelLg2}
										onChange={(e) =>
											setValue({
												...value,
												general: {
													...value.general,
													altLabelsLg2_: e.target.value,
												},
											})
										}
									/>
								</div>
							</Row>
						);
					},
				)}
				{Object.entries(notesGroupByKey).map(([key, values], index) => {
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
								{values[keyLg1Uri] && (
									<>
										<label htmlFor={keyLg1}>{D1[titleMapping[key]]}</label>
										<EditorMarkdown
											text={values[keyLg1]}
											handleChange={(v) =>
												setValue({
													...value,
													general: { ...value.general, keyLg1: v },
												})
											}
										/>
									</>
								)}
							</div>
							<div className="form-group col-md-6">
								{values[keyLg2Uri] && (
									<>
										<label htmlFor={keyLg2}>{D2[titleMapping[key]]}</label>
										<EditorMarkdown
											text={values[keyLg2]}
											handleChange={(v) =>
												setValue({
													...value,
													general: { ...value.general, keyLg2: v },
												})
											}
										/>
									</>
								)}
							</div>
						</Row>
					);
				})}
			</form>
		</div>
	);
};
