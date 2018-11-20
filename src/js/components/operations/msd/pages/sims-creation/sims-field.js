import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { rangeType } from 'js/utils/msd/';
import DatePickerRmes from 'js/components/shared/date-picker-rmes';
import InputRmes from 'js/components/shared/input-rmes';
import EditorMarkdown from 'js/components/shared/editor-markdown';
import SelectRmes from 'js/components/shared/select-rmes';

import './sims-field.scss';

const { REPORTED_ATTRIBUTE, TEXT, DATE, CODE_LIST } = rangeType;

function Field({
	msd,
	currentSection = {},
	handleChange,
	codesLists,
	secondLang,
}) {
	return (
		<React.Fragment>
			<dl>
				<dt>{D.labelTitle}:</dt>
				<dd>{msd.masLabelLg2}</dd>
			</dl>
			{!msd.isPresentational && (
				<React.Fragment>
					{msd.rangeType === TEXT && (
						<InputRmes
							id={msd.idMas}
							value={currentSection.labelLg1}
							handleChange={value => {
								handleChange({
									id: msd.idMas,
									override: { labelLg1: value },
								});
							}}
							label={D.simsValue}
						/>
					)}
					{secondLang &&
						msd.rangeType === TEXT && (
							<InputRmes
								id={msd.idMas}
								value={currentSection.labelLg2}
								handleChange={value => {
									handleChange({
										id: msd.idMas,
										override: { labelLg2: value },
									});
								}}
								label={D.altLabelTitle}
							/>
						)}
					{msd.rangeType === DATE && (
						<React.Fragment>
							<label>{D.simsValue}</label>
							<DatePickerRmes
								aria-label={D.simsValue}
								id={msd.idMas}
								colMd={12}
								value={currentSection.value}
								onChange={value => {
									handleChange({
										id: msd.idMas,
										override: { value },
									});
								}}
							/>
						</React.Fragment>
					)}
					{msd.rangeType === REPORTED_ATTRIBUTE && (
						<React.Fragment>
							<label>{D.simsValue}</label>
							<EditorMarkdown
								aria-label={D.simsValue}
								text={currentSection.labelLg1}
								handleChange={value =>
									handleChange({
										id: msd.idMas,
										override: { labelLg1: value },
									})
								}
							/>
						</React.Fragment>
					)}
					{secondLang &&
						msd.rangeType === REPORTED_ATTRIBUTE && (
							<React.Fragment>
								<label>{D.altLabelTitle}</label>
								<EditorMarkdown
									aria-label={D.altLabelTitle}
									text={currentSection.labelLg2}
									handleChange={value =>
										handleChange({
											id: msd.idMas,
											override: { labelLg2: value },
										})
									}
								/>
							</React.Fragment>
						)}
					{msd.rangeType === CODE_LIST &&
						codesLists[msd.codeList] && (
							<React.Fragment>
								<label>{codesLists[msd.codeList].codeListLabelLg1}</label>
								<SelectRmes
									placeholder=""
									aria-label={codesLists[msd.codeList].codeListLabelLg1}
									className="form-control"
									value={currentSection.value}
									options={codesLists[msd.codeList].codes.map(c => ({
										label: c.labelLg1,
										value: c.code,
									}))}
									onChange={value =>
										handleChange({
											id: msd.idMas,
											override: { codeList: msd.codeList, value },
										})
									}
								/>
							</React.Fragment>
						)}
				</React.Fragment>
			)}
		</React.Fragment>
	);
}

Field.propTypes = {
	msd: PropTypes.object.isRequired,
	currentSection: PropTypes.object,
	codesLists: PropTypes.object.isRequired,
	handleChange: PropTypes.func,
	secondLang: PropTypes.bool,
};

export default Field;
