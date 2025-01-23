import { useEffect, useState } from 'react';

import { SeeButton } from '@components/buttons/see';
import {
	ClientSideError,
	GlobalClientSideErrorBloc,
} from '@components/errors-bloc';
import { TextInput } from '@components/form/input';
import LabelRequired from '@components/label-required';
import { Row } from '@components/layout';
import { RightSlidingPanel } from '@components/sliding-panel';

import { API } from '../../apis';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import { validateCode } from '../../utils';
import { CollapsiblePanel } from '../collapsible-panel';
import { CodeSlidingPanelMenu } from './code-sliding-panel-menu';
import { CodesPanelAddButton } from './codes-panel-add-button';
import './codes-panel.css';
import { Table } from './codes/table';

const CodeSlidingPanel = ({
	code: initialCode,
	handleBack,
	handleSave,
	creation,
	codelist,
}) => {
	const [code, setCode] = useState({});
	const [clientSideErrors, setClientSideErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		setCode({ ...initialCode });
	}, [initialCode]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setClientSideErrors({
			...clientSideErrors,
			errorMessage: [],
		});
		setCode({
			...code,
			[name]: value,
		});
	};

	const handleSubmit = () => {
		const clientSideErrors = validateCode(code, [], !creation);
		if (clientSideErrors.errorMessage?.length > 0) {
			setSubmitting(true);
			setClientSideErrors(clientSideErrors);
		} else {
			setClientSideErrors({});
			handleSave(code, creation);
		}
	};
	return (
		<>
			<CodeSlidingPanelMenu
				codelist={codelist}
				handleSubmit={handleSubmit}
				handleBack={handleBack}
				creation={creation}
			/>

			{submitting && clientSideErrors && (
				<GlobalClientSideErrorBloc
					clientSideErrors={clientSideErrors.errorMessage}
				/>
			)}
			<Row>
				<div className="col-md-12 form-group">
					<LabelRequired htmlFor="code">{D1.codeTitle}</LabelRequired>
					<TextInput
						disabled={!creation}
						id="code"
						name="code"
						onChange={handleChange}
						value={code.code || ''}
						aria-invalid={!!clientSideErrors.fields?.code}
						aria-describedby={
							clientSideErrors.fields?.code ? 'code-error' : null
						}
					/>
					<ClientSideError
						id="code-error"
						error={clientSideErrors?.fields?.code}
					></ClientSideError>
				</div>
			</Row>
			<Row>
				<div className="col-md-6 form-group">
					<LabelRequired htmlFor="labelLg1">{D1.labelTitle}</LabelRequired>
					<TextInput
						id="labelLg1"
						name="labelLg1"
						onChange={handleChange}
						value={code.labelLg1 || ''}
						aria-invalid={!!clientSideErrors.fields?.labelLg1}
						aria-describedby={
							clientSideErrors.fields?.labelLg1 ? 'labelLg1-error' : null
						}
					/>
					<ClientSideError
						id="labelLg1-error"
						error={clientSideErrors?.fields?.labelLg1}
					></ClientSideError>
				</div>
				<div className="col-md-6 form-group">
					<LabelRequired htmlFor="labelLg2">{D2.labelTitle}</LabelRequired>
					<TextInput
						id="labelLg2"
						name="labelLg2"
						onChange={handleChange}
						value={code.labelLg2 || ''}
						aria-invalid={!!clientSideErrors.fields?.labelLg2}
						aria-describedby={
							clientSideErrors.fields?.labelLg2 ? 'labelLg2-error' : null
						}
					/>
					<ClientSideError
						id="labelLg2-error"
						error={clientSideErrors?.fields?.labelLg2}
					></ClientSideError>
				</div>
			</Row>
			<Row>
				<div className="col-md-6 form-group">
					<label htmlFor="descriptionLg1">{D1.descriptionTitle}</label>
					<TextInput
						id="descriptionLg1"
						name="descriptionLg1"
						onChange={handleChange}
						value={code.descriptionLg1 || ''}
					/>
				</div>
				<div className="col-md-6 form-group">
					<label htmlFor="descriptionLg2">{D2.descriptionTitle}</label>
					<TextInput
						id="descriptionLg2"
						name="descriptionLg2"
						onChange={handleChange}
						value={code.descriptionLg2 || ''}
					/>
				</div>
			</Row>
		</>
	);
};

export const CodesCollapsiblePanel = ({ codelist, hidden, editable }) => {
	const [codes, setCodes] = useState([]);

	const [searchCode, setSearchCode] = useState('');
	const [searchLabel, setSearchLabel] = useState('');

	const handleSearch = (type, valueCode, valueLabel) => {
		const [handledValue, otherValue, setSearch, getCodesBySearch] =
			type === 'code'
				? [valueCode, searchLabel, setSearchCode, API.getCodesByCode]
				: [valueLabel, searchCode, setSearchLabel, API.getCodesByLabel];

		setSearch(handledValue);
		if (otherValue) {
			API.getCodesByCodeAndLabel(codelist.id, valueCode, valueLabel).then(
				(cl) => {
					setCodes(cl ?? {});
				},
			);
		} else {
			getCodesBySearch(codelist.id, handledValue).then((cl) => {
				setCodes(cl ?? {});
			});
		}
	};

	const [lazyState, setlazyState] = useState({
		first: 0,
		rows: 10,
		page: 0,
		sortField: null,
		sortOrder: null,
	});

	const [loading, setLoading] = useState(true);

	const fetchCodes = () => {
		setLoading(true);

		API.getCodesDetailedCodelist(codelist.id, (lazyState.page ?? 0) + 1)
			.then((cl) => {
				setCodes(cl ?? {});
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchCodes();
	}, [codelist.id, lazyState.page]);

	const [openPanel, setOpenPanel] = useState(false);
	const [selectedCode, setSelectedCode] = useState({});

	const onHandlePanel = (e) => {
		e.stopPropagation();
		setOpenPanel(true);
	};

	const codesWithActions = (codes.items ?? []).map((code) => {
		return {
			...code,
			broader: code.broader?.length > 0 ? code.broader.join(',') : '',
			narrower: code.narrower?.length > 0 ? code.narrower.join(',') : '',
			closeMatch: code.closeMatch?.length > 0 ? code.closeMatch.join(',') : '',
			actions: (
				<>
					{editable && (
						<SeeButton
							data-component-id={code.code}
							onClick={() => {
								setSelectedCode(code);
								setOpenPanel(true);
							}}
						></SeeButton>
					)}
					{editable && (
						<button
							type="button"
							className="btn btn-default"
							data-component-id={code.code}
							onClick={() => {
								API.deleteCodesDetailedCodelist(codelist.id, code).then(() =>
									fetchCodes(),
								);
							}}
							aria-label={D.remove}
							title={D.remove}
						>
							<span className="glyphicon glyphicon-minus"></span>
						</button>
					)}
				</>
			),
		};
	});

	return (
		<Row>
			<CollapsiblePanel
				id="code-panel"
				hidden={hidden}
				title={
					<>
						{D.codesTitle}

						{editable && (
							<CodesPanelAddButton
								codelist={codelist}
								onHandlePanel={onHandlePanel}
							/>
						)}
					</>
				}
				collapsible={false}
				children={
					<>
						<Row>
							<div className="col-md-6 form-group">
								<label htmlFor="search-code">{D.codesSearchByCode}</label>
								<TextInput
									id="search-code"
									value={searchCode}
									onChange={(e) =>
										handleSearch('code', e.target.value, searchLabel)
									}
								/>
							</div>
							<div className="col-md-6 form-group">
								<label htmlFor="search-label">{D.codesSearchByLabel}</label>
								<TextInput
									id="search-label"
									value={searchLabel}
									onChange={(e) =>
										handleSearch('label', searchCode, e.target.value)
									}
								/>
							</div>
						</Row>

						<Table
							codesWithActions={codesWithActions}
							loading={loading}
							onPage={setlazyState}
							total={codes.total}
							state={lazyState}
						/>
					</>
				}
			/>

			<RightSlidingPanel
				isOpen={openPanel}
				backdropClicked={() => setOpenPanel(false)}
			>
				<div id="code-edit-panel">
					<CodeSlidingPanel
						code={selectedCode}
						codelist={codelist}
						creation={!selectedCode.code}
						handleBack={() => {
							setSelectedCode({});
							setOpenPanel(false);
						}}
						handleSave={(code, creation) => {
							let promise;
							if (creation) {
								promise = API.postCodesDetailedCodelist;
							} else {
								promise = API.putCodesDetailedCodelist;
							}

							promise(codelist.id, code)
								.then(() => fetchCodes())
								.then(() => {
									setSelectedCode({});
									setOpenPanel(false);
								});
						}}
					></CodeSlidingPanel>
				</div>
			</RightSlidingPanel>
		</Row>
	);
};
