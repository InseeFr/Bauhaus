import React, { PureComponent, useCallback } from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { rangeType } from 'js/utils/msd/';
import DatePickerRmes from 'js/applications/shared/date-picker-rmes';
import InputRmes from 'js/applications/shared/input-rmes';
import { EditorMarkdownToolbar, ArrayUtils } from 'bauhaus-utilities';
import { Editor } from 'react-draft-wysiwyg';

import { Note, getLang, Select } from '@inseefr/wilco';
import { isLink, isDocument } from 'js/applications/operations/document/utils';
import './sims-field.scss';
import DocumentsBloc from '../../documents/documents-bloc';

const { RICH_TEXT, TEXT, DATE, CODE_LIST, ORGANIZATION } = rangeType;

export const DocumentField = ({ handleChange, msd, currentSection }) => {
	const handleDeleteDocument = useCallback(
		uri => {
			console.log('handle delete');
			const objects = currentSection.documents || [];
			console.log({
				id: msd.idMas,
				override: {
					documents: objects.filter(doc => doc.uri !== uri),
				},
			});
			handleChange({
				id: msd.idMas,
				override: {
					documents: objects.filter(doc => doc.uri !== uri),
				},
			});
		},
		[handleChange, currentSection.documents, msd.idMas]
	);

	const handleAddDocument = useCallback(
		newObject => {
			console.log('handle add');

			const objects = currentSection.documents || [];
			console.log({
				id: msd.idMas,
				override: {
					documents: [...objects, newObject],
				},
			});
			handleChange({
				id: msd.idMas,
				override: {
					documents: [...objects, newObject],
				},
			});
		},
		[handleChange, msd.idMas, currentSection.documents]
	);

	return (
		<div className="bauhaus-document-field">
			<DocumentsBloc
				documents={(currentSection.documents || []).filter(isDocument)}
				localPrefix={'Lg1'}
				editMode={true}
				deleteHandler={handleDeleteDocument}
				addHandler={handleAddDocument}
				objectType="documents"
			/>
			<DocumentsBloc
				documents={(currentSection.documents || []).filter(isLink)}
				localPrefix={'Lg1'}
				editMode={true}
				deleteHandler={handleDeleteDocument}
				addHandler={handleAddDocument}
				objectType="links"
			/>
		</div>
	);
};

DocumentField.propTypes = {
	msd: PropTypes.object.isRequired,
	currentSection: PropTypes.object,
	codesLists: PropTypes.object.isRequired,
	handleChange: PropTypes.func,
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
								<Select
									placeholder=""
									aria-label={codesList.codeListLabelLg1}
									className="form-control"
									value={codesListOptions.find(
										({ value }) => value === currentSection.value
									)}
									options={codesListOptions}
									onChange={this.handleCodeListInput}
								/>
							)}
						</span>
					)
				}
			/>
		);
	}
}

export default Field;
