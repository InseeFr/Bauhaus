import { D1, D2 } from '../../../../../i18n';
import { useThemes } from '../../useThemes';
import { withCodesLists } from '../../../../../hooks/hooks';
import ReactSelect from 'react-select';
import { LabelRequired } from '@inseefr/wilco';
import { ClientSideError } from '../../../../../utils';
import { convertCodesListsToSelectOption } from '../../../../../utils/datasets/codelist-to-select-options';
import { CL_FREQ } from '../../../../../actions/constants/codeList';
import { TextInput, Row } from '../../../../../new-architecture/components';
import { useOrganizations } from '../../../../../new-architecture/utils/hooks/organizations';

const GlobalInformationTab = ({
	editingDataset,
	setEditingDataset,
	clientSideErrors,
	setClientSideErrors,
	...props
}) => {
	const clFreqOptions = convertCodesListsToSelectOption(props[CL_FREQ]);

	const { data: organisations } = useOrganizations();
	const organisationsOptions =
		organisations?.map(({ iri, label }) => ({ value: iri, label })) ?? [];

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
						<ReactSelect
							value={editingDataset.accrualPeriodicity}
							options={clFreqOptions}
							onChange={(option) => {
								setEditingDataset({
									...editingDataset,
									accrualPeriodicity: option?.value,
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
						<ReactSelect
							unclearable
							multi={true}
							value={editingDataset.creators}
							options={organisationsOptions}
							onChange={(values) => {
								setEditingDataset({
									...editingDataset,
									creators: values.map((v) => v.value),
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
						<ReactSelect
							unclearable
							value={editingDataset.publisher}
							options={organisationsOptions}
							onChange={(option) => {
								setEditingDataset({
									...editingDataset,
									publisher: option?.value,
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
						<ReactSelect
							unclearable
							multi={true}
							value={editingDataset.themes}
							options={themesOptions}
							onChange={(values) => {
								setEditingDataset({
									...editingDataset,
									themes: values.map(({ value }) => value),
								});
							}}
						/>
					</label>
				</div>
			</Row>
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
		</>
	);
};

export const GlobalInformation = withCodesLists([CL_FREQ])(
	GlobalInformationTab
);
