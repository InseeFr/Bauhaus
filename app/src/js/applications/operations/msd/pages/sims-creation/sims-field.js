import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { rangeType } from 'js/utils/msd/';
import DatePickerRmes from 'js/applications/shared/date-picker-rmes';
import InputRmes from 'js/applications/shared/input-rmes';
import { EditorMarkdownToolbar, ArrayUtils, EditorDeleteButton } from 'bauhaus-utilities';
import { SimsGeographyPicker } from 'bauhaus-operations';
import { Editor } from 'react-draft-wysiwyg';
import { Note, getLang, Select } from '@inseefr/wilco';
import './sims-field.scss';

const { RICH_TEXT, TEXT, DATE, CODE_LIST, ORGANIZATION, GEOGRAPHY } = rangeType;
const SimsCodeListSelect = (props) => {
	let value;
	let onChange;

	if (!props.multi) {
		value = props.options.find(
			({ value }) => value === props.currentSection.value
		);
		onChange = props.onChange;
	} else {
		const currentSectionValue = Array.isArray(props.currentSection.value)
			? props.currentSection.value
			: [props.currentSection.value];

		value = props.options.filter(({ value }) =>
			currentSectionValue.includes(value)
		);
		onChange = (values) => {
			props.onChange((values || []).map(({ value }) => value));
		};
	}

	return (
		<Select
			placeholder=""
			aria-label={props['aria-label']}
			className="form-control"
			value={value}
			options={props.options}
			onChange={onChange}
			multi={props.multi}
		/>
	);
};

class SimsField extends PureComponent {
	static propTypes = {
		msd: PropTypes.object.isRequired,
		currentSection: PropTypes.object,
		codesLists: PropTypes.object.isRequired,
		handleChange: PropTypes.func,
		secondLang: PropTypes.bool,
	};

	_handleChange(override) {
		this.props.handleChange({
			id: this.props.msd.idMas,
			override,
		});
	}

	handleTextInput = (value) => {
		this._handleChange({
			[this.props.secondLang ? 'labelLg2' : 'labelLg1']: value,
		});
	};

	handleCodeListInput = (value) => {
		this._handleChange({ codeList: this.props.msd.codeList, value });
	};
	handleGeography = (uri) => {
		this._handleChange({ uri });
	};

	render() {
		const {
			msd,
			currentSection = {},
			secondLang,
			lang,
			alone,
			organisationsOptions = [],
			unbounded,
		} = this.props;
		const codesList = this.props.codesLists[msd.codeList] || {};
		const codes = codesList.codes || [];
		const codesListOptions = ArrayUtils.sortArrayByLabel(
			codes.map((c) => ({
				label: c.labelLg1,
				value: c.code,
			}))
		);

		const currentToolbar = {
			...EditorMarkdownToolbar,
			options: ['list', 'inline'],
		};

		let value;
		switch (msd.rangeType){
			case TEXT:
				value = currentSection[secondLang ? 'labelLg2' : 'labelLg1'];
				break;
			case ORGANIZATION:
				value = organisationsOptions.find(
					({ value }) => value === currentSection.value
				)
				break;
			case Date:
				value = currentSection.value;
				break;
			case RICH_TEXT:
				value = currentSection[secondLang ? 'labelLg2' : 'labelLg1']
				break;
			case GEOGRAPHY:
				value = currentSection.uri;
				break;
			case CODE_LIST:
				value = currentSection.value;
				break;
			default:
				value = currentSection.value;
		}

		return (
			<Note
				title={<SimsFieldTitle currentSection={currentSection} msd={msd} secondLang={secondLang} organisationsOptions={organisationsOptions}/>}
				alone={alone}
				lang={lang}
				text={
					!msd.isPresentational && (
						<span className="simsField">
							{msd.rangeType === TEXT && (
								<InputRmes
									id={msd.idMas}
									value={value}
									handleChange={this.handleTextInput}
									arias={{
										'aria-label': D.simsValue,
									}}
									className="w-100"
								/>
							)}
							{msd.rangeType === ORGANIZATION && (
								<Select
									placeholder=""
									className="form-control"
									value={value}
									options={organisationsOptions}
									onChange={this.handleCodeListInput}
								/>
							)}
							{msd.rangeType === DATE && (
								<DatePickerRmes
									aria-label={D.simsValue}
									id={msd.idMas}
									colMd={12}
									value={value}
									onChange={this.handleCodeListInput}
								/>
							)}

							{msd.rangeType === RICH_TEXT && (
								<>
									<Editor
										editorState={value}
										toolbarCustomButtons={[<EditorDeleteButton />]}
										toolbar={currentToolbar}
										toolbarClassName="home-toolbar"
										wrapperClassName="home-wrapper"
										editorClassName="home-editor"
										onEditorStateChange={this.handleTextInput}
										onBlur={this.handleLeave}
										localization={{
											locale: getLang(),
										}}
									/>
								</>
							)}

							{msd.rangeType === CODE_LIST && codesList && (
								<SimsCodeListSelect
									aria-label={codesList.codeListLabelLg1}
									currentSection={currentSection}
									options={codesListOptions}
									onChange={this.handleCodeListInput}
									multi={unbounded}
								/>
							)}

							{msd.rangeType === GEOGRAPHY && (
								<SimsGeographyPicker
									value={value}
									onChange={this.handleGeography}
								/>
							)}
						</span>
					)
				}
			/>
		);
	}
}

const SimsFieldTitle = ({ msd, secondLang, currentSection, organisationsOptions }) => {
	return (
		<>
			<SimsFieldTitleIndicatorBridge msd={msd} currentSection={currentSection} secondLang={secondLang} organisationsOptions={organisationsOptions}/> {msd.idMas} - {msd[secondLang ? 'masLabelLg2' : 'masLabelLg1']}
		</>
	)
}


export const SimsFieldTitleIndicatorBridge = ({ msd, currentSection, organisationsOptions, secondLang }) => {
	let value;
	let isEmpty;

	switch (msd.rangeType){
		case TEXT:
			value = currentSection[secondLang ? 'labelLg2' : 'labelLg1'];
			isEmpty = !value
			break;
		case ORGANIZATION:
			value = organisationsOptions.find(
				({ value }) => value === currentSection.value
			)
			isEmpty = !value
			break;
		case Date:
			value = currentSection.value;
			isEmpty = !value
			break;
		case RICH_TEXT:
			value = currentSection[secondLang ? 'labelLg2' : 'labelLg1']
			isEmpty = !value.getCurrentContent || !value.getCurrentContent().hasText();
			break;
		case GEOGRAPHY:
			value = currentSection.uri;
			isEmpty = !value
			break;
		case CODE_LIST:
			value = currentSection.value;
			isEmpty = !value || value.length === 0
			break;
		default:
			value = currentSection.value;
			isEmpty = !value
	}

	return <SimsFieldTitleIndicator msd={msd} isEmpty={isEmpty} />
}

export const SimsFieldTitleIndicator = ({ msd, isEmpty }) => {
	if(msd.minOccurs !== "1"){
		return <></>
	}

	if(isEmpty){
		return (<span ariaLabel={D.essentialRubricKo} title={D.essentialRubricKo}>⚠️</span>)
	}

	return (<span ariaLabel={D.essentialRubricOk} title={D.essentialRubricOk}>✅</span>)

}
export default SimsField;
