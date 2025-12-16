import { ClientSideError } from '@components/errors-bloc';
import { TextInput } from '@components/form/input';
import { InputMulti } from '@components/ui/forms/input-multi';
import LabelRequired from '@components/label-required';
import { Row } from '@components/layout';
import { Select } from '@components/select-rmes';

import { withCodesLists } from '@utils/hoc/withCodesLists';

import { D1, D2 } from '../../../../deprecated-locales';
import { CL_FREQ } from '../../../../redux/actions/constants/codeList';
import { D1 as DatasetDictionary } from '../../../i18n';
import { convertCodesListsToSelectOption } from '../../../utils/codelist-to-select-options';
import { OrganisationInput } from '@components/business/stamps-input/stamps-input';
import { useThemes } from '../../../hooks/useThemes';

const GlobalInformationTab = ({
	editingDataset,
	setEditingDataset,
	clientSideErrors,
	setClientSideErrors,
	...props
}) => {
	const clFreqOptions = convertCodesListsToSelectOption(props[CL_FREQ]);

	const { data: themesOptions = [] } = useThemes();

	return (
		<>
			<Row>
				<div className="col-md-6 form-group">
					<LabelRequired htmlFor="labelLg1">{D1.title}</LabelRequired>
					<TextInput
						id="labelLg1"
						value={editingDataset.labelLg1}
						onChange={(e) => {
							setEditingDataset({
								...editingDataset,
								labelLg1: e.target.value,
							});
							setClientSideErrors((clientSideErrors) => ({
								...clientSideErrors,
								errorMessage: [],
							}));
						}}
					/>
					<ClientSideError
						error={clientSideErrors?.fields?.labelLg1}
					></ClientSideError>
				</div>
				<div className="col-md-6 form-group">
					<LabelRequired htmlFor="labelLg2">{D2.title}</LabelRequired>
					<TextInput
						id="labelLg2"
						value={editingDataset.labelLg2}
						onChange={(e) => {
							setEditingDataset({
								...editingDataset,
								labelLg2: e.target.value,
							});
							setClientSideErrors((clientSideErrors) => ({
								...clientSideErrors,
								errorMessage: [],
							}));
						}}
					/>
					<ClientSideError
						error={clientSideErrors?.fields?.labelLg2}
					></ClientSideError>
				</div>
			</Row>
			<Row>
				<div className="col-md-6 form-group">
					<label htmlFor="subtitleLg1">{D1.datasetsSubtitle}</label>
					<TextInput
						id="subtitleLg1"
						value={editingDataset.subTitleLg1}
						onChange={(e) => {
							setEditingDataset({
								...editingDataset,
								subTitleLg1: e.target.value,
							});
						}}
					/>
				</div>
				<div className="col-md-6 form-group">
					<label htmlFor="subtitleLg2">{D2.datasetsSubtitle}</label>
					<TextInput
						id="subtitleLg2"
						value={editingDataset.subTitleLg2}
						onChange={(e) => {
							setEditingDataset({
								...editingDataset,
								subTitleLg2: e.target.value,
							});
						}}
					/>
				</div>
			</Row>
			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.datasetsFirstDiffusion}
						<input
							type="date"
							className="form-control"
							value={editingDataset.issued}
							onChange={(e) => {
								setEditingDataset({
									...editingDataset,
									issued: e.target.value,
								});
							}}
						/>
					</label>
				</div>
			</Row>
			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.datasetsUpdatedDate}
						<input
							type="date"
							className="form-control"
							value={editingDataset.updated}
							onChange={(e) => {
								setEditingDataset({
									...editingDataset,
									updated: e.target.value,
								});
							}}
						/>
					</label>
				</div>
			</Row>
			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.datasetsUpdateFrequency}
						<Select
							value={editingDataset.accrualPeriodicity}
							options={clFreqOptions}
							onChange={(value) => {
								setEditingDataset({
									...editingDataset,
									accrualPeriodicity: value,
								});
							}}
						/>
					</label>
				</div>
			</Row>
			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.datasetsDataProvider}
						<OrganisationInput
							multi
							value={editingDataset.creators}
							onChange={(values) => {
								setEditingDataset({
									...editingDataset,
									creators: values,
								});
							}}
						/>
					</label>
				</div>
			</Row>
			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.datasetsPublicationProvider}
						<OrganisationInput
							value={editingDataset.publisher}
							onChange={(values) => {
								setEditingDataset({
									...editingDataset,
									publisher: values,
								});
							}}
						/>
					</label>
				</div>
			</Row>
			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.theme}
						<Select
							multi
							value={editingDataset.themes}
							options={themesOptions}
							onChange={(values) => {
								setEditingDataset({
									...editingDataset,
									themes: values,
								});
							}}
						/>
					</label>
				</div>
			</Row>
			<InputMulti
				inputLg1={editingDataset.keywords?.lg1}
				inputLg2={editingDataset.keywords?.lg2}
				label={DatasetDictionary.datasets.keywords}
				handleChangeLg1={(keywords) => {
					setEditingDataset({
						...editingDataset,
						keywords: {
							...editingDataset.keywords,
							lg1: keywords,
						},
					});
				}}
				handleChangeLg2={(keywords) => {
					setEditingDataset({
						...editingDataset,
						keywords: {
							...editingDataset.keywords,
							lg2: keywords,
						},
					});
				}}
			/>
			<Row>
				<div className="col-md-6 form-group">
					<label htmlFor="landingPageLg1">{D1.datasetsLandingPage}</label>
					<TextInput
						id="landingPageLg1"
						value={editingDataset.landingPageLg1}
						onChange={(e) => {
							setEditingDataset({
								...editingDataset,
								landingPageLg1: e.target.value,
							});
						}}
					/>
				</div>
				<div className="col-md-6 form-group">
					<label htmlFor="landingPageLg2">{D2.datasetsLandingPage}</label>
					<TextInput
						id="landingPageLg2"
						value={editingDataset.landingPageLg2}
						onChange={(e) => {
							setEditingDataset({
								...editingDataset,
								landingPageLg2: e.target.value,
							});
						}}
					/>
				</div>
			</Row>
			<InputMulti
				inputLg1={editingDataset.linkedDocuments}
				label={DatasetDictionary.datasets.linkedDocuments}
				handleChangeLg1={(linkedDocuments) => {
					setEditingDataset({
						...editingDataset,
						linkedDocuments,
					});
				}}
			/>
		</>
	);
};

export const GlobalInformation = withCodesLists([CL_FREQ])(
	GlobalInformationTab,
);
