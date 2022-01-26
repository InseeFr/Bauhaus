import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { default as ReactSelect } from 'react-select';
import {
	CancelButton,
	SaveButton,
	ActionToolbar,
	ErrorBloc,
	LabelRequired,
	Select,
} from '@inseefr/wilco';
import { Stores, useTitle } from 'bauhaus-utilities';
import { API } from '../../apis';
import {
	validatePartialCodelist,
	treedData,
	partialInGlobalCodes,
} from '../../utils';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import PartialCodesTreeEdit from './codes-tree-edit';
import '../codelist-detail/edit.scss';

export const deleteNodes = (codes, currentNode) => {
	let updatedCodes = [...codes];

	const deleteNode = (currentNode) => {
		updatedCodes = updatedCodes.filter(
			(code) => code.code !== currentNode.code
		);

		const findParent = (lengthCheck, parentNode) => {
			return (
				codes.filter(
					(code) =>
						lengthCheck(code.parents?.length) &&
						code.parents?.find(({ code }) => code === parentNode.code)
				) || []
			);
		};
		findParent((length) => length === 1, currentNode).forEach((child) =>
			deleteNode(child)
		);

		const childrenToUpdate = findParent((length) => length > 1, currentNode);
		updatedCodes = updatedCodes.map((updatedCode) => {
			const isPresent = !!childrenToUpdate.find(
				({ code }) => code === updatedCode.code
			);

			if (isPresent) {
				return {
					...updatedCode,
					parents: updatedCode.parents.filter(
						({ code }) => code !== currentNode.code
					),
				};
			} else {
				return updatedCode;
			}
		});
	};
	deleteNode(currentNode);

	return updatedCodes;
};

const defaultCodelist = {
	contributor: 'DG75-L201',
	created: dayjs(),
};
const DumbCodelistPartialDetailEdit = ({
	codelist: initialCodelist,
	handleSave,
	handleBack,
	updateMode,
	disseminationStatusListOptions,
	stampListOptions,
	globalCodeListOptions,
	serverSideError,
}) => {
	const [codelist, setCodelist] = useState(defaultCodelist);
	const [parentCodes, setParentCodes] = useState(null);
	/* const [codes, setCodes] = useState(
		Object.values(defaultCodelist.codes || {})
	);
	 const [tree, setTree] = useState(treedData(codes)); */
	const [parentTree, setParentTree] = useState(null);

	/* const deleteCode = useCallback(
		(codeToDelete) => {
			const updatedCodes = deleteNodes(codes, codeToDelete);
			setCodes(updatedCodes);
		},
		[codes]
	);

	const updateCode = useCallback(
		(codeObject) => {
			const existing = codes.find((c) => c.code === codeObject.code);
			if (!existing) {
				// Create
				setCodes([...codes.filter((c) => c.code !== ''), codeObject]);
			} else {
				// Update
				setCodes(
					codes.map((c) => {
						if (c.code === codeObject.code) {
							return codeObject;
						}
						return c;
					})
				);
			}
		},
		[codes]
	);

	const createCode = useCallback(
		(newCode) => {
			setCodes([...codes, newCode]);
		},
		[codes]
	); */

	const { field, message } = validatePartialCodelist(codelist);

	useTitle(D.codelistsTitle, codelist?.labelLg1 || D.codelistsCreateTitle);

	const handleParentCode = useCallback(
		(code) => {
			API.getDetailedCodelist(code).then((parentCL) => {
				const globalWithPartialCodes =
					partialInGlobalCodes(
						Object.values(parentCL.codes || {}),
						Object.values(codelist.codes || {})
					) || [];
				setParentCodes(globalWithPartialCodes);
			});
		},
		[codelist.codes]
	);

	const handleParent = useCallback(
		(value) => {
			setCodelist({ ...codelist, parentCode: value });
			handleParentCode(value);
		},
		[codelist, handleParentCode]
	);

	useEffect(() => {
		setCodelist({ ...initialCodelist, ...defaultCodelist });
		/* setCodes(Object.values(initialCodelist.codes || {})); */
		if (initialCodelist.parentCode) {
			handleParentCode(initialCodelist.parentCode);
		} else {
			setParentCodes([]);
		}
	}, [initialCodelist, handleParentCode]);

	useEffect(() => {
		if (parentCodes) {
			setParentTree(treedData(parentCodes));
		} else {
			setParentTree([]);
		}
	}, [parentCodes]);

	const handleChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setCodelist({
				...codelist,
				[name]: value,
			});
		},
		[codelist]
	);

	const addClickHandler = useCallback(
		(e) => {
			const currentCode = parentCodes.find(
				(c) => c.code === e.target.parentElement.dataset.componentId
			);
			setParentCodes(
				parentCodes.map((c) => {
					if (c.code === currentCode.code) {
						return { ...c, isPartial: true };
					}
					return c;
				})
			);
		},
		[parentCodes]
	);

	const removeClickHandler = useCallback(
		(e) => {
			const currentCode = parentCodes.find(
				(c) => c.code === e.target.parentElement.dataset.componentId
			);
			setParentCodes(
				parentCodes.map((c) => {
					if (c.code === currentCode.code) {
						return { ...c, isPartial: false };
					}
					return c;
				})
			);
		},
		[parentCodes]
	);

	const handleSaveClick = useCallback(() => {
		handleSave(codelist);
	}, [codelist, handleSave]);

	return (
		<React.Fragment>
			<ActionToolbar>
				<CancelButton action={handleBack} col={3} />
				<SaveButton disabled={message} action={handleSaveClick} col={3} />
			</ActionToolbar>
			{message && <ErrorBloc error={message} />}
			{serverSideError && <ErrorBloc error={serverSideError} />}
			<form>
				<div className="row">
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="id">{D1.idTitle}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="id"
							name="id"
							value={codelist.id || ''}
							onChange={handleChange}
							aria-invalid={field === ''}
							disabled={updateMode}
						/>
					</div>
				</div>
				<div className="row">
					<div className={`col-md-12 form-group`}>
						<LabelRequired htmlFor="parentCode">
							{D1.parentCodelist}
						</LabelRequired>
						<Select
							className="form-control"
							placeholder={D1.parentCodelistPlaceholder}
							value={globalCodeListOptions?.find(
								({ value }) => value === codelist.parentCode
							)}
							options={globalCodeListOptions}
							onChange={handleParent}
							searchable={true}
							disabled={updateMode}
						/>
					</div>
				</div>
				<div className="row">
					<div className={`col-md-6 form-group`}>
						<LabelRequired htmlFor="labelLg1">{D1.labelTitle}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="labelLg1"
							name="labelLg1"
							onChange={handleChange}
							value={codelist.labelLg1 || ''}
							aria-invalid={field === ''}
						/>
					</div>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg2">{D2.labelTitle}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="labelLg2"
							name="labelLg2"
							onChange={handleChange}
							value={codelist.labelLg2 || ''}
							aria-invalid={field === ''}
						/>
					</div>
				</div>
				<div className="form-group">
					<LabelRequired htmlFor="creator">{D1.creator}</LabelRequired>
					<Select
						className="form-control"
						placeholder={D1.stampsPlaceholder}
						value={stampListOptions.find(
							({ value }) => value === codelist.creator
						)}
						options={stampListOptions}
						onChange={(value) => setCodelist({ ...codelist, creator: value })}
						searchable={true}
					/>
				</div>
				<div className="form-group">
					<label>{D1.contributor}</label>
					<ReactSelect
						placeholder={D1.stampsPlaceholder}
						value={stampListOptions.find(
							({ value }) => value === codelist.contributor
						)}
						options={stampListOptions}
						onChange={(value) =>
							setCodelist({ ...codelist, contributor: value })
						}
						isDisabled={true}
					/>
				</div>
				<div className="form-group">
					<LabelRequired htmlFor="disseminationStatus">
						{D1.disseminationStatusTitle}
					</LabelRequired>
					<Select
						className="form-control"
						placeholder={D1.disseminationStatusPlaceholder}
						value={disseminationStatusListOptions.find(
							({ value }) => value === codelist.disseminationStatus
						)}
						options={disseminationStatusListOptions}
						onChange={(value) =>
							setCodelist({ ...codelist, disseminationStatus: value })
						}
						searchable={true}
					/>
				</div>
				<div className="row">
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg1">{D1.descriptionTitle}</label>
						<textarea
							type="text"
							value={codelist.descriptionLg1}
							className="form-control"
							id="descriptionLg1"
							name="descriptionLg1"
							onChange={handleChange}
						/>
					</div>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D2.descriptionTitle}</label>
						<textarea
							type="text"
							value={codelist.descriptionLg2}
							className="form-control"
							id="descriptionLg2"
							name="descriptionLg2"
							onChange={handleChange}
						/>
					</div>
				</div>
				{codelist.parentCode && parentCodes && parentTree && (
					<div className="row">
						<PartialCodesTreeEdit
							codes={parentCodes}
							tree={parentTree}
							handleChangeTree={(tree) => setParentTree(tree)}
							addClickHandler={addClickHandler}
							removeClickHandler={removeClickHandler}
							readOnly={true}
						/>
					</div>
				)}
			</form>
		</React.Fragment>
	);
};

DumbCodelistPartialDetailEdit.propTypes = {
	component: PropTypes.object,
	disseminationStatusListOptions: PropTypes.array,
	stampListOptions: PropTypes.array,
	globalCodeListOptions: PropTypes.array,
	handleSave: PropTypes.func,
	handleBack: PropTypes.func,
	updateMode: PropTypes.bool,
	secondLang: PropTypes.bool,
};

DumbCodelistPartialDetailEdit.defaultProps = {
	disseminationStatusListOptions: [],
	stampListOptions: [],
	globalCodeListOptions: [],
};

export const CodeListPartialDetailEdit =
	Stores.DisseminationStatus.withDisseminationStatusListOptions(
		DumbCodelistPartialDetailEdit
	);
