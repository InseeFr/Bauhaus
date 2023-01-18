import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { default as ReactSelect } from 'react-select';
import {
	CancelButton,
	SaveButton,
	ActionToolbar,
	LabelRequired,
	Select,
} from '@inseefr/wilco';
import { Stores, useTitle, ErrorBloc } from 'bauhaus-utilities';
import { validateCodelist } from '../../utils';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import CodesTreeEdit from './codes-tree-edit';
import './edit.scss';
import { CollapsiblePanel } from '../collapsible-panel';

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
const DumbCodelistDetailEdit = ({
	codelist: initialCodelist,
	handleSave,
	handleBack,
	updateMode,
	disseminationStatusListOptions,
	stampListOptions,
	serverSideError,
}) => {
	const [codelist, setCodelist] = useState(defaultCodelist);
	const [codes, setCodes] = useState(
		Object.values(defaultCodelist.codes || {})
	);

	const deleteCode = useCallback(
		({ code }) => {
			const selectedCode = codes.find((c) => c.code === code);
			if (selectedCode) {
				const children = codes
					.filter((c) => c.parents?.some((parent) => parent.code === code))
					.map(({ code }) => code);
				const newParents = selectedCode.parents || [];
				setCodes(
					codes
						.filter((c) => c.code !== code)
						.map((c) => {
							if (children.includes(c.code)) {
								const parents = [
									...(c.parents || []).filter((c) => c !== code),
									...newParents,
								];
								return {
									...c,
									parents,
								};
							} else {
								return c;
							}
						})
				);
			}
		},
		[codes]
	);

	const deleteCodeWithChildren = useCallback(
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
	);

	const { errors: clientSideErrors } = validateCodelist(codelist);

	useTitle(D.codelistsTitle, codelist?.labelLg1 || D.codelistsCreateTitle);

	useEffect(() => {
		setCodelist({ ...initialCodelist, ...defaultCodelist });
		setCodes(initialCodelist.codes ? Object.values(initialCodelist.codes) : []);
	}, [initialCodelist]);

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

	const handleSaveClick = useCallback(() => {
		handleSave(codelist);
	}, [codelist, handleSave]);

	return (
		<React.Fragment>
			<ActionToolbar>
				<CancelButton action={handleBack} col={3} />
				<SaveButton disabled={clientSideErrors.length > 0} action={handleSaveClick} col={3} />
			</ActionToolbar>
			{clientSideErrors && <ErrorBloc error={clientSideErrors} D={D}/>}
			{serverSideError && <ErrorBloc error={serverSideError} D={D}/>}
			<form>
				<div className="row">
					<div className={`col-md-12 form-group`}>
						<LabelRequired htmlFor="lastListUriSegment">
							{D1.lastListUriSegmentTitle}
						</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="lastListUriSegment"
							name="lastListUriSegment"
							onChange={handleChange}
							value={codelist.lastListUriSegment || ''}
							disabled={updateMode && codelist.lastListUriSegment !== ''}
						/>
					</div>
				</div>
				<div className="row">
					<div className={`col-md-12 form-group`}>
						<LabelRequired htmlFor="lastCodeUriSegment">
							{D1.lastCodeUriSegmentTitle}
						</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="lastCodeUriSegment"
							name="lastCodeUriSegment"
							onChange={handleChange}
							value={codelist.lastCodeUriSegment || ''}
							disabled={updateMode && codelist.lastCodeUriSegment !== ''}
						/>
					</div>
				</div>
				<div className="row">
					<div className={`col-md-12 form-group`}>
						<LabelRequired htmlFor="lastClassUriSegment">
							{D1.lastClassUriSegmentTitle}
						</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="lastClassUriSegment"
							name="lastClassUriSegment"
							onChange={handleChange}
							value={codelist.lastClassUriSegment || ''}
							disabled={updateMode && codelist.lastClassUriSegment !== ''}
						/>
					</div>
				</div>
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
				<div className="code-zone">
					<CollapsiblePanel
						id="code-picker"
						hidden={false}
						title={D.codesTreeTitle}
						children={
							<CodesTreeEdit
								deleteCode={deleteCode}
								deleteCodeWithChildren={deleteCodeWithChildren}
								updateCode={updateCode}
								createCode={createCode}
								codes={codes || {}}
								handleAdd={true}
								readOnly={false}
							/>
						}
					/>
				</div>
			</form>
		</React.Fragment>
	);
};

DumbCodelistDetailEdit.propTypes = {
	component: PropTypes.object,
	disseminationStatusListOptions: PropTypes.array,
	stampListOptions: PropTypes.array,
	handleSave: PropTypes.func,
	handleBack: PropTypes.func,
	updateMode: PropTypes.bool,
	secondLang: PropTypes.bool,
};

DumbCodelistDetailEdit.defaultProps = {
	disseminationStatusListOptions: [],
	stampListOptions: [],
};

export const CodeListDetailEdit =
	Stores.DisseminationStatus.withDisseminationStatusListOptions(
		DumbCodelistDetailEdit
	);
