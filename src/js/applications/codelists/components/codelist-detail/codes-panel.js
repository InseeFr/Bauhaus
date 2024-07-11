import { useEffect, useState } from 'react';
import { API } from '../../apis';
import { ClientSideError, GlobalClientSideErrorBloc } from 'js/utils';
import { CollapsiblePanel } from '../collapsible-panel';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import { rowParams } from '../code-detail/code-columns';
import { LabelRequired, Table } from '@inseefr/wilco';
import SlidingPanel from 'react-sliding-side-panel';
import './codes-panel.scss';
import { validateCode } from '../../utils';
import { CodesPanelAddButton } from './codes-panel-add-button';
import { CodeSlidingPanelMenu } from './code-sliding-panel-menu';
import { TextInput, Row } from '../../../../new-architecture/components';
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
					D={D}
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
							!!clientSideErrors.fields?.code ? 'code-error' : null
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
							!!clientSideErrors.fields?.labelLg1 ? 'labelLg1-error' : null
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
							!!clientSideErrors.fields?.labelLg2 ? 'labelLg2-error' : null
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
	const [currentPage, setCurrentPage] = useState(1);

	const [sort, setSort] = useState('code');

	useEffect(() => {
		API.getSortedCodes(codelist.id, sort).then((cl) => {
			setCodes(cl ?? {});
		});
	}, [codelist.id, sort]);

	const tableHead = rowParams.map(
		({ dataField, text, classifiable, ...rowParam }) => ({
			dataField,
			text: classifiable ? (
				<>
					{text}
					<button
						type="button"
						onClick={() =>
							sort === dataField ? setSort('code') : setSort(dataField)
						}
						aria-label={D.sort}
						title={D.sort}
					>
						<span
							className={
								sort === dataField
									? 'glyphicon glyphicon-triangle-top'
									: 'glyphicon glyphicon-triangle-bottom'
							}
						></span>
					</button>
				</>
			) : (
				text
			),
			...rowParam,
		})
	);

	const [searchCode, setSearchCode] = useState('');
	const [searchLabel, setSearchLabel] = useState('');

	const handleSearch = (type, valueCode, valueLabel) => {
		const [handledValue, otherValue, setSearch, getCodesBySearch] =
			type === 'code'
				? [valueCode, searchLabel, setSearchCode, API.getCodesByCode]
				: [valueLabel, searchCode, setSearchLabel, API.getCodesByLabel];

		setSearch(handledValue);
		otherValue
			? API.getCodesByCodeAndLabel(codelist.id, valueCode, valueLabel).then(
					(cl) => {
						setCodes(cl ?? {});
					}
			  )
			: getCodesBySearch(codelist.id, handledValue).then((cl) => {
					setCodes(cl ?? {});
			  });
	};

	useEffect(() => {
		if (currentPage > 0) {
			API.getCodesDetailedCodelist(codelist.id, currentPage).then((cl) => {
				setCodes(cl ?? {});
			});
		}
	}, [codelist.id, currentPage]);

	function isActivePage(page) {
		return page === currentPage;
	}

	function checkInvalidPage(targetPage, listSize) {
		return targetPage === 0 || targetPage > listSize;
	}

	function isDisabled(targetPage) {
		return checkInvalidPage(targetPage, pageNumbers.length);
	}

	const pageNumbers = [];
	const numberOfPages = Math.ceil((codes.total ?? 0) / 5);
	for (let i = 1; i <= numberOfPages; i++) {
		pageNumbers.push(i);
	}

	const renderPageNumbers = pageNumbers
		.filter((number) => number - 3 < currentPage && number + 3 > currentPage)
		.map((number) => {
			return (
				<li className={isActivePage(number) ? 'active' : ''} key={number}>
					<button
						type="button"
						aria-current={number === currentPage}
						onClick={() => setCurrentPage(number)}
					>
						{number}
					</button>
				</li>
			);
		});

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
						<button
							type="button"
							data-component-id={code.code}
							onClick={() => {
								setSelectedCode(code);
								setOpenPanel(true);
							}}
							aria-label={D.see}
							title={D.see}
						>
							<span className="glyphicon glyphicon-eye-open"></span>
						</button>
					)}
					{editable && (
						<button
							type="button"
							data-component-id={code.code}
							onClick={() => {
								setCurrentPage(0);
								API.deleteCodesDetailedCodelist(codelist.id, code).then(() =>
									setCurrentPage(1)
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

						<Table rowParams={tableHead} data={codesWithActions} />

						{numberOfPages > 1 && (
							<div
								className="server-side-pagination col-md-12"
								style={{ padding: 0 }}
							>
								<ul className="wilco-pagination">
									<li>
										<button
											type="button"
											disabled={isDisabled(currentPage - 1)}
											onClick={() => setCurrentPage(1)}
										>
											<span aria-hidden="true">&laquo;</span>
										</button>
									</li>
									<li>
										<button
											type="button"
											disabled={isDisabled(currentPage - 1)}
											onClick={() => setCurrentPage(currentPage - 1)}
										>
											<span aria-hidden="true">&lt;</span>
										</button>
									</li>
									{renderPageNumbers}
									<li>
										<button
											type="button"
											disabled={isDisabled(currentPage + 1)}
											onClick={() => setCurrentPage(currentPage + 1)}
										>
											<span aria-hidden="true">&gt;</span>
										</button>
									</li>
									<li>
										<button
											type="button"
											disabled={isDisabled(currentPage + 1)}
											onClick={() => setCurrentPage(numberOfPages)}
										>
											<span aria-hidden="true">&raquo;</span>
										</button>
									</li>
								</ul>
							</div>
						)}
					</>
				}
			/>

			<SlidingPanel
				type={'right'}
				isOpen={openPanel}
				size={60}
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

							setCurrentPage(0);
							promise(codelist.id, code).then(() => {
								setSelectedCode({});
								setOpenPanel(false);
								setCurrentPage(1);
							});
						}}
					></CodeSlidingPanel>
				</div>
			</SlidingPanel>
		</Row>
	);
};
