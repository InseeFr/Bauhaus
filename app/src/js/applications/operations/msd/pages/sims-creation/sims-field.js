import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { rangeType } from 'js/utils/msd/';
import DatePickerRmes from 'js/applications/shared/date-picker-rmes';
import InputRmes from 'js/applications/shared/input-rmes';
import { EditorMarkdownToolbar, ArrayUtils } from 'bauhaus-utilities';
import { Editor } from 'react-draft-wysiwyg';
import SimsGeographyField from './sims-geography-field';
import { Note, getLang, Select } from '@inseefr/wilco';
import './sims-field.scss';

const { RICH_TEXT, TEXT, DATE, CODE_LIST, ORGANIZATION, GEOGRAPHY } = rangeType;

const SimsCodeListSelect = props => {
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
		onChange = values => {
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

class Field extends PureComponent {
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

	handleTextInput = value => {
		this._handleChange({
			[this.props.secondLang ? 'labelLg2' : 'labelLg1']: value,
		});
	};

	handleCodeListInput = value => {
		this._handleChange({ codeList: this.props.msd.codeList, value });
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
			codes.map(c => ({
				label: c.labelLg1,
				value: c.code,
			}))
		);

		const currentToolbar = {
			...EditorMarkdownToolbar,
			options: ['list', 'inline'],
		};
		return (
			<Note
				title={`${msd.idMas} - ${
					msd[secondLang ? 'masLabelLg2' : 'masLabelLg1']
				}`}
				alone={alone}
				lang={lang}
				text={
					!msd.isPresentational && (
						<span className="simsField">
							{msd.rangeType === TEXT && (
								<InputRmes
									id={msd.idMas}
									value={currentSection[secondLang ? 'labelLg2' : 'labelLg1']}
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
									value={organisationsOptions.find(
										({ value }) => value === currentSection.value
									)}
									options={organisationsOptions}
									onChange={this.handleCodeListInput}
								/>
							)}
							{msd.rangeType === DATE && (
								<DatePickerRmes
									aria-label={D.simsValue}
									id={msd.idMas}
									colMd={12}
									value={currentSection.value}
									onChange={this.handleCodeListInput}
								/>
							)}

							{msd.rangeType === RICH_TEXT && (
								<>
									<Editor
										editorState={
											currentSection[secondLang ? 'labelLg2' : 'labelLg1']
										}
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

							{msd.rangeType === GEOGRAPHY && <SimsGeographyField />}
						</span>
					)
				}
			/>
		);
	}
}

export default Field;
