import React, { Component } from 'react';
import PageSubtitle from 'js/components/shared/page-subtitle';
import PageTitle from 'js/components/shared/page-title';
import D from 'js/i18n';
import { goBack } from 'js/utils/redirection';
import NoteFlag from 'js/components/shared/note-flag/note-flag';
import PropTypes from 'prop-types';
import EditorMarkdown from 'js/components/shared/editor-html/editor-markdown';
import Button from 'js/components/shared/button';
import { validate } from 'js/components/operations/document/edition/validation';
const defaultDocument = {
	labelLg1: '',
	labelLg2: '',
	descriptionLg1: '',
	descriptionLg2: '',
	url: '',
	lang: '',
};
class OperationsDocumentationEdition extends Component {
	static propTypes = {
		document: PropTypes.object.isRequired,
		langs: PropTypes.object.isRequired,
		saveDocument: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = {
			document: {
				...defaultDocument,
				...props.document,
			},
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			document: {
				...defaultDocument,
				...nextProps.document,
			},
		});
	}

	onChange = e => {
		this.setState({
			document: {
				...this.state.document,
				[e.target.id]: e.target.value,
			},
		});
	};
	onSubmit = () => {
		this.props.saveDocument(
			this.state.document,
			(id = this.state.document.id) => {
				this.props.history.push(`/operations/document/${id}`);
			}
		);
	};

	render() {
		const {
			langs: { lg1, lg2 },
		} = this.props;
		const { document } = this.state;
		const isEditing = !!document.id;

		const errors = validate(document);

		return (
			<div className="container editor-container">
				{isEditing && (
					<React.Fragment>
						<PageTitle
							title={this.props.document.labelLg1}
							context="operations"
						/>
						{this.props.document.labelLg2 && (
							<PageSubtitle
								subTitle={this.props.document.labelLg2}
								context="operations"
							/>
						)}
					</React.Fragment>
				)}

				<div className="row btn-line">
					<Button
						action={goBack(this.props, '/operations/documents')}
						label={
							<React.Fragment>
								<span
									className="glyphicon glyphicon-floppy-remove"
									aria-hidden="true"
								/>
								<span> {D.btnCancel}</span>
							</React.Fragment>
						}
						context="operations"
					/>

					<div className="col-md-8 centered">
						<div
							style={{ visibility: errors.errorMessage ? 'visible' : 'hidden' }}
							className="alert alert-danger bold"
							role="alert"
						>
							{/* HACK: if no content, the line height is set to 0 and the rest
	              of the page moves a little  */}
							{errors.errorMessage || (
								<span style={{ whiteSpace: 'pre-wrap' }}> </span>
							)}
						</div>
					</div>
					<Button
						action={this.onSubmit}
						label={
							<React.Fragment>
								<span
									className="glyphicon glyphicon-floppy-disk"
									aria-hidden="true"
								/>
								<span> {D.btnSave}</span>
							</React.Fragment>
						}
						context="operations"
						disabled={errors.errorMessage}
					/>
				</div>
				<form>
					<div className="row">
						<div className="col-md-6 form-group">
							<label htmlFor="prefLabelLg1">
								<NoteFlag text={D.title} lang={lg1} />
								<span className="boldRed">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								id="labelLg1"
								value={document.labelLg1}
								onChange={this.onChange}
								aria-invalid={errors.fields.labelLg1}
							/>
						</div>
						<div className="col-md-6 form-group">
							<label htmlFor="prefLabelLg2">
								<NoteFlag text={D.title} lang={lg2} />
								<span className="boldRed">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								id="labelLg2"
								value={document.labelLg2}
								onChange={this.onChange}
								aria-invalid={errors.fields.labelLg2}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-6 form-group">
							<label htmlFor="abstractLg1">
								<NoteFlag text={D.descriptionTitle} lang={lg1} />
							</label>
							<EditorMarkdown
								text={document.descriptionLg1}
								handleChange={value =>
									this.onChange({ target: { value, id: 'descriptionLg1' } })
								}
							/>
						</div>
						<div className="col-md-6 form-group">
							<label htmlFor="abstractLg2">
								<NoteFlag text={D.descriptionTitle} lang={lg2} />
							</label>
							<EditorMarkdown
								text={document.descriptionLg2}
								handleChange={value =>
									this.onChange({ target: { value, id: 'descriptionLg2' } })
								}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12 form-group">
							<label htmlFor="url">
								<NoteFlag text={D.titleLink} lang={lg1} />
								<span className="boldRed">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								id="url"
								value={document.url}
								onChange={this.onChange}
								aria-invalid={errors.fields.url}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12 form-group">
							<label htmlFor="lang">
								<NoteFlag text={D.langTitle} lang={lg1} />
								<span className="boldRed">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								id="lang"
								value={document.lang}
								onChange={this.onChange}
								aria-invalid={errors.fields.lang}
							/>
						</div>
					</div>
				</form>
			</div>
		);
		// TODO n'afficher que l'URL pour les liens
		// TODO ajouter un select pour savoir si c'est un lien ou un document qu'on souhaite creer
	}
}

export default OperationsDocumentationEdition;
