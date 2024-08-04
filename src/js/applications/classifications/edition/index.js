import { useClassification, useUpdateClassification } from '../hooks';
import { useParams, Redirect } from 'react-router-dom';
import { ActionToolbar, LabelRequired } from '@inseefr/wilco';
import { EditorMarkdown, useTitle } from '../../../utils';
import { useForm, Controller } from 'react-hook-form';
import SelectRmes from '../../../utils/components/select-rmes';
import D, { D1, D2 } from '../../../i18n';
import { useQuery } from '@tanstack/react-query';
import api from '../../../remote-api/classifications-api';
import {
	TextInput,
	Row,
	Loading,
	ClientSideError,
	GlobalClientSideErrorBloc,
	PageTitleBlock,
} from '../../../new-architecture/components';
import { useStampsOptions } from '../../../new-architecture/utils/hooks/stamps';
import { useOrganizationsOptions } from '../../../new-architecture/utils/hooks/organizations';
import { transformModelToSelectOptions } from '../../../new-architecture/utils/transformer';
import { useDisseminationStatusOptions } from '../../../new-architecture/utils/hooks/disseminationStatus';
import { useGoBack } from '../../../new-architecture/utils/hooks/useGoBack';

export const ClassificationEdition = () => {
	const goBack = useGoBack();
	const { id } = useParams();
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm({
		criteriaMode: 'all',
		mode: 'all',
	});

	const { isLoading, classification } = useClassification(id);
	useTitle(D.classificationsTitle, classification?.general?.prefLabelLg1);

	const { save, isSavingSuccess, isSaving } = useUpdateClassification(id);

	const { data: series } = useQuery({
		queryKey: ['classifications-series'],
		queryFn: () => {
			return api.getSeriesList();
		},
	});
	const seriesOptions = transformModelToSelectOptions(series ?? []);

	const disseminationStatusOptions = useDisseminationStatusOptions();
	const organisationsOptions = useOrganizationsOptions();

	const stampsOptions = useStampsOptions();
	const { data: classifications } = useQuery({
		queryKey: ['classifications'],
		queryFn: api.getList,
	});
	const classificationsOptions =
		classifications
			?.filter((classification) => classification.id !== id)
			?.map(({ id, label }) => ({ value: id, label })) ?? [];

	if (isLoading) return <Loading />;

	if (isSaving) return <Loading textType="saving" />;

	if (isSavingSuccess) {
		return <Redirect to={'/classifications/classification/' + id} />;
	}

	return (
		<div className="container editor-container">
			<PageTitleBlock
				titleLg1={classification?.general?.prefLabelLg1}
				titleLg2={classification?.general?.prefLabelLg2}
				secondLang={true}
			/>

			<form
				onSubmit={handleSubmit((value) =>
					save({
						general: { ...classification.general, ...value },
						levels: classification.levels,
					})
				)}
			>
				<ActionToolbar>
					<div className="col-md-2">
						<button
							onClick={() => goBack('/classifications')}
							className="btn wilco-btn btn-lg col-md-12"
							type="button"
						>
							<span
								className={`glyphicon glyphicon-floppy-remove`}
								aria-hidden="true"
							/>
							<span>{D.btnCancel}</span>
						</button>
					</div>
					<div className="col-md-2">
						<button className="btn wilco-btn btn-lg col-md-12" type="submit">
							<span
								className={`glyphicon glyphicon-floppy-disk`}
								aria-hidden="true"
							/>
							<span>{D.btnSave}</span>
						</button>
					</div>
				</ActionToolbar>

				{
					<GlobalClientSideErrorBloc
						clientSideErrors={Object.values(errors)}
						D={D}
					/>
				}

				<Row>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="prefLabelLg1">{D1.title}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="prefLabelLg1"
							{...register('prefLabelLg1', { required: D.requiredPrefLabel })}
							defaultValue={classification.general.prefLabelLg1}
							aria-describedby="prefLabelLg1-error"
							aria-invalid={!!errors?.prefLabelLg1?.message}
						/>
						<ClientSideError
							id="prefLabelLg1-error"
							error={errors?.prefLabelLg1?.message}
						></ClientSideError>
					</div>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="prefLabelLg2">{D2.title}</LabelRequired>
						<input
							id="prefLabelLg2"
							className="form-control"
							type="text"
							{...register('prefLabelLg2', { required: D.requiredPrefLabel })}
							defaultValue={classification.general.prefLabelLg2}
							aria-describedby="prefLabelLg2-error"
							aria-invalid={!!errors?.prefLabelLg2?.message}
						/>
						<ClientSideError
							id="prefLabelLg2-error"
							error={errors?.prefLabelLg2?.message}
						></ClientSideError>
					</div>
				</Row>
				<Row>
					<div className="form-group col-md-6">
						<label htmlFor="altLabelLg1">{D1.altLabel}</label>
						<TextInput
							id="altLabelLg1"
							{...register('altLabelLg1')}
							defaultValue={classification.general.altLabelLg1}
						/>
					</div>
					<div className="form-group col-md-6">
						<label htmlFor="altLabelLg2">{D2.altLabel}</label>
						<TextInput
							id="altLabelLg2"
							{...register('altLabelLg2')}
							defaultValue={classification.general.altLabelLg2}
						/>
					</div>
				</Row>
				<Row>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg1">{D1.summary}</label>
						<Controller
							name="descriptionLg1"
							control={control}
							defaultValue={classification.general.descriptionLg1}
							render={({ field: { onChange, value } }) => {
								return <EditorMarkdown text={value} handleChange={onChange} />;
							}}
						/>
					</div>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D2.summary}</label>
						<Controller
							name="descriptionLg2"
							control={control}
							defaultValue={classification.general.descriptionLg2}
							render={({ field: { onChange, value } }) => {
								return <EditorMarkdown text={value} handleChange={onChange} />;
							}}
						/>
					</div>
				</Row>
				<div className="form-group">
					<label>{D1.motherSeries}</label>
					<Controller
						name="idSeries"
						control={control}
						defaultValue={classification.general.idSeries}
						render={({ field: { onChange, value } }) => {
							return (
								<SelectRmes
									value={seriesOptions.find((option) => option.value === value)}
									options={seriesOptions}
									onChange={onChange}
								/>
							);
						}}
					/>
				</div>
				<div className="form-group">
					<label>{D1.classificationsBeforeTitle}</label>
					<Controller
						name="idBefore"
						control={control}
						defaultValue={classification.general.idBefore}
						render={({ field: { onChange, value } }) => {
							return (
								<SelectRmes
									value={classificationsOptions.find(
										(option) => option.value === value
									)}
									options={classificationsOptions}
									onChange={onChange}
								/>
							);
						}}
					/>
				</div>
				<div className="form-group">
					<label>{D1.classificationsAfterTitle}</label>
					<Controller
						name="idAfter"
						control={control}
						defaultValue={classification.general.idAfter}
						render={({ field: { onChange, value } }) => {
							return (
								<SelectRmes
									value={classificationsOptions.find(
										(option) => option.value === value
									)}
									options={classificationsOptions}
									onChange={onChange}
								/>
							);
						}}
					/>
				</div>
				<div className="form-group">
					<label>{D1.classificationsVariantTitle}</label>
					<Controller
						name="idVariant"
						control={control}
						defaultValue={classification.general.idVariant}
						render={({ field: { onChange, value } }) => {
							return (
								<SelectRmes
									value={classificationsOptions.find(
										(option) => option.value === value
									)}
									options={classificationsOptions}
									onChange={onChange}
								/>
							);
						}}
					/>
				</div>
				<div className="form-group">
					<label className="w-100">
						{D1.creatorTitle}
						<Controller
							name="creator"
							control={control}
							defaultValue={classification.general.creator}
							render={({ field: { onChange, value } }) => {
								return (
									<SelectRmes
										value={organisationsOptions.find(
											(option) => option.value === value
										)}
										options={organisationsOptions}
										onChange={onChange}
									/>
								);
							}}
						/>
					</label>
				</div>
				<div className="form-group">
					<label className="w-100">
						{D1.contributorTitle}
						<Controller
							name="contributor"
							control={control}
							defaultValue={classification.general.contributor}
							render={({ field: { onChange, value } }) => {
								return (
									<SelectRmes
										value={stampsOptions.find(
											(option) => option.value === value
										)}
										options={stampsOptions}
										onChange={onChange}
									/>
								);
							}}
						/>
					</label>
				</div>

				<div className="form-group">
					<label>{D1.disseminationStatusTitle}</label>
					<Controller
						name="disseminationStatus"
						control={control}
						defaultValue={classification.general.disseminationStatus}
						render={({ field: { onChange, value } }) => {
							return (
								<SelectRmes
									value={disseminationStatusOptions.find(
										(option) => option.value === value
									)}
									options={disseminationStatusOptions}
									onChange={onChange}
								/>
							);
						}}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="additionalMaterial">
						{D1.additionalMaterialTitle}
					</label>
					<input
						type="url"
						className="form-control"
						id="additionalMaterial"
						{...register('additionalMaterial', {
							pattern: {
								value: /^(http|https)/,
								message: D1.additionalMaterialHttp,
							},
						})}
						defaultValue={classification.general.additionalMaterial}
						aria-describedby="additionalMaterial-error"
						aria-invalid={!!errors?.additionalMaterial?.message}
					/>
					<ClientSideError
						id="additionalMaterial-error"
						error={errors?.additionalMaterial?.message}
					></ClientSideError>
				</div>
				<div className="form-group">
					<label htmlFor="legalMaterial">{D1.legalMaterialTitle}</label>
					<input
						type="url"
						className="form-control"
						id="legalMaterial"
						{...register('legalMaterial', {
							pattern: {
								value: /^(http|https)/,
								message: D1.legalMaterialHttp,
							},
						})}
						defaultValue={classification.general.legalMaterial}
						aria-describedby="legalMaterial-error"
						aria-invalid={!!errors?.legalMaterial?.message}
					/>
					<ClientSideError
						id="legalMaterial-error"
						error={errors?.legalMaterial?.message}
					></ClientSideError>
				</div>
				<div className="form-group">
					<label htmlFor="homepage">{D1.homepageTitle}</label>
					<input
						type="url"
						className="form-control"
						id="homepage"
						{...register('homepage', {
							pattern: {
								value: /^(http|https)/,
								message: D1.homepageHttp,
							},
						})}
						defaultValue={classification.general.homepage}
						aria-describedby="homepage-error"
						aria-invalid={!!errors?.homepage?.message}
					/>
					<ClientSideError
						id="homepage-error"
						error={errors?.homepage?.message}
					></ClientSideError>
				</div>
				{(classification.general.scopeNoteUriLg1 ||
					classification.general.scopeNoteUriLg2) && (
					<>
						<Row>
							<div className="col-md-6 form-group">
								{classification.general.scopeNoteUriLg1 && (
									<>
										<LabelRequired htmlFor="scopeNoteLg1">
											{D1.classificationsScopeNote}
										</LabelRequired>
										<Controller
											name="scopeNoteLg1"
											control={control}
											defaultValue={classification.general.scopeNoteLg1}
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
							<div className="col-md-6 form-group">
								{classification.general.scopeNoteUriLg2 && (
									<>
										<LabelRequired htmlFor="scopeNoteLg2">
											{D2.classificationsScopeNote}
										</LabelRequired>
										<Controller
											name="scopeNoteLg2"
											control={control}
											defaultValue={classification.general.scopeNoteLg2}
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
					</>
				)}
				{(classification.general.changeNoteUriLg1 ||
					classification.general.changeNoteUriLg2) && (
					<>
						<Row>
							<div className="col-md-6 form-group">
								{classification.general.changeNoteUriLg1 && (
									<>
										<LabelRequired htmlFor="scopeNoteLg1">
											{D1.classificationsChangeNote()}
										</LabelRequired>
										<Controller
											name="changeNoteLg1"
											control={control}
											defaultValue={classification.general.changeNoteLg1}
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
							<div className="col-md-6 form-group">
								{classification.general.changeNoteUriLg2 && (
									<>
										<LabelRequired htmlFor="scopeNoteLg2">
											{D2.classificationsChangeNote()}
										</LabelRequired>
										<Controller
											name="changeNoteLg2"
											control={control}
											defaultValue={classification.general.changeNoteLg2}
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
					</>
				)}
			</form>
		</div>
	);
};
