import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
	CancelButton,
	SaveButton,
	ActionToolbar,
	ErrorBloc,
	LabelRequired,
	Select,
} from '@inseefr/wilco';
import { AppContext, Stores } from 'bauhaus-utilities';
import { validateComponent } from '../../utils';
import { MUTUALIZED_COMPONENT_TYPES } from '../../utils/constants/dsd-components';
import { XSD_CODE_LIST, XSD_TYPES } from '../../utils/constants/xsd';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import PropTypes from 'prop-types';
import { default as ReactSelect } from 'react-select';
import "./edit.scss";
import { CodesListPanel } from "../codes-list-panel/codes-list-panel"
import { FormGroup } from 'react-bootstrap';


const defaultComponent = {
	contributor: 'DG75-H250'
}
const DumbComponentDetailEdit = ({
	component: initialComponent,
	concepts,
	codesLists,
	handleSave,
	handleBack,
	type,
	disseminationStatusListOptions,
	stampListOptions,
	serverSideError
}) => {
	const [codesListPanelOpened, setCodesListPanelOpened] = useState(false);
	const [component, setComponent] = useState(defaultComponent);
	const { lg1, lg2 } = useContext(AppContext);
	useEffect(() => {
		setComponent({ ...initialComponent, ...defaultComponent });
	}, [initialComponent]);
	useEffect(() => {
		if(!component.type && type){
			setComponent({ ...defaultComponent, ...initialComponent, type });
		}
	}, [type, component, initialComponent]);

	const handleChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setComponent({
				...component,
				[name]: value,
			});
		},
		[component]
	);

	const handleSaveClick = useCallback(() => {
		handleSave(component);
	}, [component, handleSave]);

	const conceptOptions = concepts.map(({ id, label }) => ({
		value: id,
		label,
	}));
	const codeListOptions = codesLists.map(({ id, label }) => ({
		value: id,
		label,
	}));
	const { field, message } = validateComponent(component);

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
						<LabelRequired htmlFor="identifiant">{D1.idTitle}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="identifiant"
							name="identifiant"
							value={component.identifiant}
							onChange={handleChange}
							aria-invalid={field === 'identifiant'}
						/>
					</div>
				</div>
				<div className="row">
					<div className={`col-md-6 form-group`}>
						<LabelRequired htmlFor="labelLg1">{D1.label} ({lg1})</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="labelLg1"
							name="labelLg1"
							onChange={handleChange}
							value={component.labelLg1}
							aria-invalid={field === 'labelLg1'}
						/>
					</div>

					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg2">{D2.label} ({lg2})</LabelRequired>

						<input
							type="text"
							className="form-control"
							id="labelLg2"
							name="labelLg2"
							value={component.labelLg2}
							onChange={handleChange}
						/>
					</div>
				</div>

				<div className="row">
					<div className="col-md-12 ">
					<FormGroup>
						<label><LabelRequired>{D1.type}</LabelRequired></label>
						<ReactSelect
							placeholder={D1.type}
							value={MUTUALIZED_COMPONENT_TYPES.find(
								(c) => c.value === (component.type)
							)}
							options={MUTUALIZED_COMPONENT_TYPES}
							onChange={(type) => setComponent({ ...component, type: type.value })}
							isDisabled={!!component.id}
						/>
					</FormGroup>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						<Select
							id="concept"
							name="concept"
							label={D1.conceptTitle}
							placeholder={D1.conceptTitle}
							options={conceptOptions}
							value={conceptOptions.find(
								(c) => c.value === component.concept?.toString()
							)}
							onChange={(value) =>
								setComponent({ ...component, concept: value })
							}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						<Select
							id="range"
							name="range"
							label={D1.rangeTitle}
							placeholder={D1.rangeTitle}
							value={XSD_TYPES.find((c) => c.value === component.range)}
							options={XSD_TYPES}
							onChange={(value) => {
								setComponent({ ...component, range: value, codeList: undefined })
							}}
						/>
					</div>
				</div>
				{component.range === XSD_CODE_LIST && (
					<div className="row">
						<div className="col-md-12 form-group code-list-zone">
							<Select
								type="text"
								className="form-control"
								id="codeList"
								name="codeList"
								label={D1.codesListTitle}
								placeholder={D1.codesListTitle}
								options={codeListOptions}
								value={codeListOptions.find((c) =>
									component.codeList?.toString().includes(c.value?.toString())
								)}
								onChange={(value) =>
									setComponent({ ...component, codeList: value })
								}
							/>
							<button
								type="button"
								disabled={!component.codeList}
								onClick={() => setCodesListPanelOpened(true)}
							>
								{D.see}
							</button>
						</div>
					</div>
				)}
				<div className="form-group">
					<label>
						{D1.creatorTitle}
					</label>
					<Select
						className="form-control"
						placeholder={D1.stampsPlaceholder}
						value={stampListOptions.find(({ value }) => value === component.creator)}
						options={stampListOptions}
						onChange={(value) =>
							setComponent({ ...component, creator: value })
						}
						searchable={true}
					/>
				</div>
				<div className="form-group">
					<label>{D1.contributorTitle}</label>
					<ReactSelect
						placeholder={D1.stampsPlaceholder}
						value={stampListOptions.find(({ value }) => value === component.contributor)}
						options={stampListOptions}
						onChange={(value) =>
							setComponent({ ...component, contributor: value })
						}
						isDisabled={true}
					/>
				</div>
				<div className="form-group">
					<label>{D1.disseminationStatusTitle}</label>
					<Select
						className="form-control"
						placeholder={D1.disseminationStatusPlaceholder}
						value={disseminationStatusListOptions.find(({ value }) => value === component.disseminationStatus)}
						options={disseminationStatusListOptions}
						onChange={(value) =>
							setComponent({ ...component, disseminationStatus: value })
						}
						searchable={true}
					/>
				</div>
				<div className="row">
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D1.descriptionTitle} ({lg1})</label>
						<input
							type="text"
							value={component.descriptionLg1}
							className="form-control"
							id="descriptionLg1"
							name="descriptionLg1"
							onChange={handleChange}
						/>
					</div>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D1.descriptionTitle} ({lg2})</label>
						<input
							type="text"
							value={component.descriptionLg2}
							className="form-control"
							id="descriptionLg2"
							name="descriptionLg2"
							onChange={handleChange}
						/>
					</div>
				</div>
			</form>
			<CodesListPanel codesList={codesLists.find((c) =>
				(component.codeList?.id || component.codeList)?.toString().includes(c.id?.toString())
			)} isOpen={codesListPanelOpened} handleBack={() => setCodesListPanelOpened(false)}/>
		</React.Fragment>
	);
};

DumbComponentDetailEdit.propTypes = {
	component: PropTypes.object,
	concepts: PropTypes.array,
	codesLists: PropTypes.array,
	disseminationStatusListOptions: PropTypes.array,
	stampListOptions: PropTypes.array,
	handleSave: PropTypes.func,
	handleBack: PropTypes.func,
	secondLang: PropTypes.bool,
	structureComponents: PropTypes.array,
};

DumbComponentDetailEdit.defaultProps = {
	structureComponents: [],
	concepts: [],
	codesLists: [],
	disseminationStatusListOptions: [],
	stampListOptions: []
};

export const ComponentDetailEdit = Stores.DisseminationStatus.withDisseminationStatusListOptions(DumbComponentDetailEdit);
