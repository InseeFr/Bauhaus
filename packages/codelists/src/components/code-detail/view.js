import React from 'react';
import { Note, ActionToolbar, ReturnButton, ErrorBloc } from '@inseefr/wilco';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import { HTMLUtils } from 'bauhaus-utilities';
import PropTypes from 'prop-types';
import './view.scss';

export const CodeDetailView = ({
	code,
	codes,
	handleBack,
	secondLang,
	col = 3,
	serverSideError,
}) => {
	const descriptionLg1 = HTMLUtils.renderMarkdownElement(code.descriptionLg1);
	const descriptionLg2 = HTMLUtils.renderMarkdownElement(code.descriptionLg2);

	const codesOptions = codes.map((code) => {
		return {
			label: code.code + ' - ' + code.labelLg1,
			value: code.code,
		};
	});

	return (
		<React.Fragment>
			<ActionToolbar>
				<ReturnButton action={handleBack} col={col} />
			</ActionToolbar>
			<ErrorBloc error={serverSideError} />

			<div className="row">
				<Note
					text={
						<ul>
							{codesOptions
								.filter(
									({ value }) =>
										code.parents &&
										code.parents.some((parent) => parent.code === value)
								)
								.map((code) => (
									<li key={code.value}>{code.label}</li>
								))}
						</ul>
					}
					title={D1.parentCodeTitle}
					alone={true}
				/>
			</div>
			<div className="row">
				<Note text={code.code} title={D.codeTitle} alone={true} />
			</div>
			<div className="row">
				<Note text={code.labelLg1} title={D1.codeLabel} alone={!secondLang} />
				{secondLang && (
					<Note text={code.labelLg2} title={D2.codeLabel} alone={false} />
				)}
			</div>
			<div className="row">
				<Note
					text={descriptionLg1}
					title={D1.codeDescription}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={descriptionLg2}
						title={D2.codeDescription}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</div>
		</React.Fragment>
	);
};

CodeDetailView.propTypes = {
	code: PropTypes.object,
	codes: PropTypes.array,
	handleBack: PropTypes.func,
	secondLang: PropTypes.bool,
};
