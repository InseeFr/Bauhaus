import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { Navigate, useParams } from 'react-router-dom';
import { default as ReactSelect } from 'react-select';
import { ErrorBloc } from '@components/errors-bloc';
import { Loading, Saving } from '@components/loading';
import { PageTitleBlock } from '@components/page-title-block';
import { Row } from '@components/layout';
import { TextInput } from '@components/form/input';
import { EditorMarkdown } from '@components/rich-editor/editor-markdown';
import { ActionToolbar } from '@components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '@components/buttons/buttons-with-icons';
import LabelRequired from '@components/label-required';
import D, { D1, D2 } from '../../../deprecated-locales/build-dictionary';
import { ClassificationsApi } from '@sdk/classification';
import { fetchingPreviousLevels } from '../client';
import useClassificationItem from '../hook';

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
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm({
		criteriaMode: 'firstError',
		mode: 'all',
	});

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
		useQuery({
			queryKey: ['classification-parent-levels', classificationId, itemId],
			queryFn: () => {
				return fetchingPreviousLevels(classificationId, item.general);
			},
			enabled: !!item.general,
		});

	const previousLevelsOptions = previousLevels.map((previousLevel) => ({
		value: previousLevel.item,
		label: previousLevel.labelLg1,
	}));

	if (isLoading || isPreviousLevelsLoading) return <Loading />;

	if (isSaving) return <Saving />;

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

	const errorMessage = Object.values(errors)?.[0]?.message;
	const { general, notes } = item;

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

	return (
		<div className="container editor-container">
			<PageTitleBlock
				titleLg1={general?.prefLabelLg1}
				titleLg2={general?.prefLabelLg2}
				secondLang={true}
			/>

			<form onSubmit={handleSubmit((value) => formatAndSave(value))}>
				<ActionToolbar>
					<CancelButton action="/classifications" type="button"></CancelButton>
					<SaveButton type="submit"></SaveButton>
				</ActionToolbar>
				{errorMessage && <ErrorBloc error={errorMessage} />}
				<Row>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="prefLabelLg1">{D1.title}</LabelRequired>
						<TextInput
							id="prefLabelLg1"
							{...register('prefLabelLg1', { required: D.requiredPrefLabel })}
							defaultValue={general.prefLabelLg1}
						/>
					</div>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="prefLabelLg2">{D2.title}</LabelRequired>
						<TextInput
							id="prefLabelLg2"
							{...register('prefLabelLg2', { required: D.requiredPrefLabel })}
							defaultValue={general.prefLabelLg2}
						/>
					</div>
				</Row>
				<Row>
					<div className="form-group col-md-6">
						<label htmlFor="altLabelLg1">{D1.altLabel}</label>
						<TextInput
							id="altLabelLg1"
							{...register('altLabelLg1')}
							defaultValue={general.altLabelLg1}
						/>
					</div>
					<div className="form-group col-md-6">
						<label htmlFor="altLabelLg2">{D2.altLabel}</label>
						<TextInput
							id="altLabelLg2"
							{...register('altLabelLg2')}
							defaultValue={general.altLabelLg2}
						/>
					</div>
				</Row>
				<Row></Row>
				<div className="form-group">
					<label>{D.classificationsBroaderLevel}</label>
					<Controller
						name="broaderURI"
						control={control}
						defaultValue={general.broaderURI}
						render={({ field: { onChange, value } }) => {
							return (
								<ReactSelect
									value={previousLevelsOptions.find(
										(option) => option.value === value,
									)}
									options={previousLevelsOptions}
									onChange={(option) => onChange(option.value)}
									clearable={false}
								/>
							);
						}}
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
										{...register('altLabelsLg1_' + length, {
											maxLength: {
												value: Number(length),
												message: D1.classificationItemAltError(length),
											},
										})}
										defaultValue={shortLabelLg1}
									/>
								</div>

								<div className="form-group col-md-6">
									<label htmlFor={'altLabelsLg2_' + length}>
										{D2.classificationItemAltLabels(length)}
									</label>
									<TextInput
										id={'altLabelsLg2_' + length}
										{...register('altLabelsLg2_' + length, {
											maxLength: {
												value: Number(length),
												message: D1.classificationItemAltError(length),
											},
										})}
										defaultValue={shortLabelLg2}
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
										<Controller
											name={keyLg1}
											control={control}
											defaultValue={values[keyLg1]}
											render={({ field: { onChange, value } }) => {
												return (
													<EditorMarkdown
														text={value}
														handleChange={onChange}
													/>
												);
											}}
										/>
									</>
								)}
							</div>
							<div className="form-group col-md-6">
								{values[keyLg2Uri] && (
									<>
										<label htmlFor={keyLg2}>{D2[titleMapping[key]]}</label>
										<Controller
											name={keyLg2}
											control={control}
											defaultValue={values[keyLg2]}
											render={({ field: { onChange, value } }) => {
												return (
													<EditorMarkdown
														text={value}
														handleChange={onChange}
													/>
												);
											}}
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
