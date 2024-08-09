import { PureComponent } from 'react';
import D from '../../../../../i18n';
import { rangeType } from '../../../../../new-architecture/modules-operations/utils/msd';
import { DatePicker } from '../../../../../new-architecture/components';
import InputRmes from '../../../../../applications/shared/input-rmes';
import {
	EditorMarkdownToolbar,
	ArrayUtils,
	EditorDeleteButton,
} from '../../../../../utils';
import SimsGeographyPicker from '../../../../../applications/operations/components/sims/sims-geography-picker';
import { Editor } from 'react-draft-wysiwyg';
import { Note, getLang } from '@inseefr/wilco';
import './sims-field.scss';
import { SimsFieldTitle } from '../../sims-field-title';
import Select from '../../../../../utils/components/select-rmes';

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
			value={value}
			options={props.options}
			onChange={onChange}
			multi={props.multi}
		/>
	);
};

class SimsField extends PureComponent {
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
		const codesListOptionsLg2 = ArrayUtils.sortArrayByLabel(
			codes.map((c) => ({
				label: c.labelLg2,
				value: c.code,
			}))
		);

		const currentToolbar = {
			...EditorMarkdownToolbar,
			options: ['list', 'inline'],
		};

		let value;
		switch (msd.rangeType) {
			case TEXT:
				value = currentSection[secondLang ? 'labelLg2' : 'labelLg1'];
				break;
			case ORGANIZATION:
				value = organisationsOptions.find(
					({ value }) => value === currentSection.value
				);
				break;
			case DATE:
				value = currentSection.value;
				break;
			case RICH_TEXT:
				value = currentSection[secondLang ? 'labelLg2' : 'labelLg1'];
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
				title={
					<SimsFieldTitle
						currentSection={currentSection}
						msd={msd}
						secondLang={secondLang}
						organisationsOptions={organisationsOptions}
					/>
				}
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
									value={value}
									options={organisationsOptions}
									onChange={this.handleCodeListInput}
								/>
							)}
							{msd.rangeType === DATE && (
								<DatePicker
									aria-label={D.simsValue}
									id={msd.idMas}
									colMd={12}
									value={value}
									onChange={this.handleCodeListInput}
									secondLang={secondLang}
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
									options={secondLang ? codesListOptionsLg2 : codesListOptions}
									onChange={this.handleCodeListInput}
									multi={unbounded}
								/>
							)}

							{msd.rangeType === GEOGRAPHY && (
								<SimsGeographyPicker
									value={value}
									onChange={this.handleGeography}
									secondLang={secondLang}
								/>
							)}
						</span>
					)
				}
			/>
		);
	}
}

export default SimsField;
