import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { GlobalClientSideErrorBloc } from '@components/errors-bloc';
import { TextInputBlock, UrlInputBlock } from '@components/form/input';
import LabelRequired from '@components/label-required';
import { Row } from '@components/layout';
import { Loading, Saving } from '@components/loading';
import { PageTitleBlock } from '@components/page-title-block';
import { Select } from '@components/select-rmes';

import { useOrganizationsOptions } from '@utils/hooks/organizations';
import { useStampsOptions } from '@utils/hooks/stamps';
import { useTitle } from '@utils/hooks/useTitle';

import { MDEditor } from '@components/rich-editor/react-md-editor';
import D, { D1, D2 } from '../../deprecated-locales';
import { transformModelToSelectOptions } from '../../utils/transformer';
import {
	useClassification,
	useClassifications,
	useSeries,
	useUpdateClassification,
} from '../hooks';
import { Menu } from './menu';
import { validate } from './validate';
import { DisseminationStatusInput } from '@components/dissemination-status/disseminationStatus';

export const Component = () => {
	const { id } = useParams();
	const { isLoading, classification, status } = useClassification(id);
	const { series } = useSeries();
	const { classifications } = useClassifications();

	const [clientSideErrors, setClientSideErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [value, setValue] = useState(classification);

	useTitle(D.classificationsTitle, classification?.general?.prefLabelLg1);

	const { save, isSavingSuccess, isSaving } = useUpdateClassification(id);

	const seriesOptions = transformModelToSelectOptions(series ?? []);

	const organisationsOptions = useOrganizationsOptions();

	const stampsOptions = useStampsOptions();
	const classificationsOptions =
		classifications
			?.filter((classification) => classification.id !== id)
			?.map(({ id, label }) => ({ value: id, label })) ?? [];

	useEffect(() => {
		if (status === 'success' && !value?.general) {
			setValue(classification);
		}
	}, [status, classification]);

	if (isLoading) return <Loading />;

	if (isSaving) return <Saving />;

	if (isSavingSuccess) {
		return <Navigate to={'/classifications/classification/' + id} replace />;
	}

	if (!value?.general) {
		return;
	}

	return (
		<div className="container editor-container">
			<PageTitleBlock
				titleLg1={classification?.general?.prefLabelLg1}
				titleLg2={classification?.general?.prefLabelLg2}
			/>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					const clientSideErrors = validate(value.general);
					if (clientSideErrors.errorMessage?.length > 0) {
						setSubmitting(true);
						setClientSideErrors(clientSideErrors);
					} else {
						setClientSideErrors({});
						save({
							general: { ...classification.general, ...value.general },
							levels: classification.levels,
						});
					}
				}}
			>
				<Menu disabled={clientSideErrors.errorMessage?.length > 0} />

				{submitting && clientSideErrors && (
					<GlobalClientSideErrorBloc
						clientSideErrors={clientSideErrors.errorMessage}
					/>
				)}

				<Row>
					<div className="col-md-6 form-group">
						<TextInputBlock
							required
							label={D1.title}
							error={clientSideErrors?.fields?.prefLabelLg1}
							value={value.general.prefLabelLg1}
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
					</div>
					<div className="col-md-6 form-group">
						<TextInputBlock
							required
							label={D2.title}
							error={clientSideErrors?.fields?.prefLabelLg2}
							value={value.general.prefLabelLg2}
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
					</div>
				</Row>
				<Row>
					<div className="form-group col-md-6">
						<TextInputBlock
							label={D1.altLabel}
							value={value.general.altLabelLg1}
							onChange={(e) =>
								setValue({
									...value,
									general: { ...value.general, altLabelLg1: e.target.value },
								})
							}
						/>
					</div>
					<div className="form-group col-md-6">
						<TextInputBlock
							label={D2.altLabel}
							value={value.general.altLabelLg2}
							onChange={(e) =>
								setValue({
									...value,
									general: { ...value.general, altLabelLg2: e.target.value },
								})
							}
						/>
					</div>
				</Row>
				<Row>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg1">{D1.summary}</label>
						<MDEditor
							text={value.general.descriptionLg1}
							handleChange={(v) =>
								setValue({
									...value,
									general: { ...value.general, descriptionLg1: v },
								})
							}
						/>
					</div>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D2.summary}</label>
						<MDEditor
							text={value.general.descriptionLg2}
							handleChange={(v) =>
								setValue({
									...value,
									general: { ...value.general, descriptionLg2: v },
								})
							}
						/>
					</div>
				</Row>
				<div className="form-group">
					<label>{D1.motherSeries}</label>
					<Select
						value={classificationsOptions.find(
							(option) => option.value === value.general.idSeries,
						)}
						options={seriesOptions}
						onChange={(v) =>
							setValue({
								...value,
								general: { ...value.general, idSeries: v },
							})
						}
					/>
				</div>
				<div className="form-group">
					<label>{D1.classificationsBeforeTitle}</label>
					<Select
						value={classificationsOptions.find(
							(option) => option.value === value.general.idBefore,
						)}
						options={classificationsOptions}
						onChange={(v) =>
							setValue({
								...value,
								general: { ...value.general, idBefore: v },
							})
						}
					/>
				</div>
				<div className="form-group">
					<label>{D1.classificationsAfterTitle}</label>
					<Select
						value={classificationsOptions.find(
							(option) => option.value === value.general.idAfter,
						)}
						options={classificationsOptions}
						onChange={(v) =>
							setValue({
								...value,
								general: { ...value.general, idAfter: v },
							})
						}
					/>
				</div>
				<div className="form-group">
					<label>{D1.classificationsVariantTitle}</label>
					<Select
						value={classificationsOptions.find(
							(option) => option.value === value.general.idVariant,
						)}
						options={classificationsOptions}
						onChange={(v) =>
							setValue({
								...value,
								general: { ...value.general, idVariant: v },
							})
						}
					/>
				</div>
				<div className="form-group">
					<label className="w-100">
						{D1.creatorTitle}
						<Select
							value={organisationsOptions.find(
								(option) => option.value === value.general.creator,
							)}
							options={organisationsOptions}
							onChange={(v) =>
								setValue({
									...value,
									general: { ...value.general, creator: v },
								})
							}
						/>
					</label>
				</div>
				<div className="form-group">
					<label className="w-100">
						{D1.contributorTitle}
						<Select
							value={stampsOptions.find(
								(option) => option.value === value.general.contributor,
							)}
							options={stampsOptions}
							onChange={(v) =>
								setValue({
									...value,
									general: { ...value.general, contributor: v },
								})
							}
						/>
					</label>
				</div>

				<div className="form-group">
					<label>{D1.disseminationStatusTitle}</label>
					<DisseminationStatusInput
						withLabel={false}
						value={value.general.disseminationStatus}
						handleChange={(v) =>
							setValue({
								...value,
								general: { ...value.general, disseminationStatus: v },
							})
						}
					/>
				</div>
				<div className="form-group">
					<UrlInputBlock
						label={D1.additionalMaterialTitle}
						error={clientSideErrors?.fields?.additionalMaterial}
						onChange={(e) =>
							setValue({
								...value,
								general: {
									...value.general,
									additionalMaterial: e.target.value,
								},
							})
						}
						value={value.general.additionalMaterial}
					/>
				</div>
				<div className="form-group">
					<UrlInputBlock
						label={D1.legalMaterialTitle}
						error={clientSideErrors?.fields?.legalMaterial}
						onChange={(e) =>
							setValue({
								...value,
								general: {
									...value.general,
									legalMaterial: e.target.value,
								},
							})
						}
						value={value.general.legalMaterial}
					/>
				</div>
				<div className="form-group">
					<UrlInputBlock
						label={D1.homepageTitle}
						error={clientSideErrors?.fields?.homepage}
						onChange={(e) =>
							setValue({
								...value,
								general: {
									...value.general,
									legalMaterial: e.target.homepage,
								},
							})
						}
						value={value.general.homepage}
					/>
				</div>
				{(classification.general.scopeNoteUriLg1 ||
					classification.general.scopeNoteUriLg2) && (
					<Row>
						<div className="col-md-6 form-group">
							{classification.general.scopeNoteUriLg1 && (
								<>
									<LabelRequired htmlFor="scopeNoteLg1">
										{D1.classificationsScopeNote}
									</LabelRequired>
									<MDEditor
										text={value.general.scopeNoteLg1}
										handleChange={(v) =>
											setValue({
												...value,
												general: { ...value.general, scopeNoteLg1: v },
											})
										}
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
									<MDEditor
										text={value.general.scopeNoteLg2}
										handleChange={(v) =>
											setValue({
												...value,
												general: { ...value.general, scopeNoteLg2: v },
											})
										}
									/>
								</>
							)}
						</div>
					</Row>
				)}
				{(classification.general.changeNoteUriLg1 ||
					classification.general.changeNoteUriLg2) && (
					<Row>
						<div className="col-md-6 form-group">
							{classification.general.changeNoteUriLg1 && (
								<>
									<LabelRequired htmlFor="scopeNoteLg1">
										{D1.classificationsChangeNote()}
									</LabelRequired>
									<MDEditor
										text={value.general.changeNoteLg1}
										handleChange={(v) =>
											setValue({
												...value,
												general: { ...value.general, changeNoteLg1: v },
											})
										}
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
									<MDEditor
										text={value.general.changeNoteLg2}
										handleChange={(v) =>
											setValue({
												...value,
												general: { ...value.general, changeNoteLg2: v },
											})
										}
									/>
								</>
							)}
						</div>
					</Row>
				)}
			</form>
		</div>
	);
};
