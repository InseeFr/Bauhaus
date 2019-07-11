import React, { Component } from 'react';
import D from 'js/i18n';
import { goBackOrReplace, goBack } from 'js/utils/redirection';
import NoteFlag from 'js/components/shared/note-flag/note-flag';
import PropTypes from 'prop-types';
import EditorMarkdown from 'js/components/shared/editor-html/editor-markdown';
import Button from 'js/components/shared/button';
import { validate } from './validation';
import Loading from 'js/components/shared/loading';
import PageTitleBlock from 'js/components/shared/page-title-block';

const defaultFamily = {
	prefLabelLg1: '',
	prefLabelLg2: '',
	themeLg1: '',
	themeLg2: '',
	abstractLg1: '',
	abstractLg2: '',
};
class OperationsFamilyEdition extends Component {
	static propTypes = {
		family: PropTypes.object.isRequired,
		langs: PropTypes.object.isRequired,
		saveFamily: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = this.setInitialState(props);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.family.id !== this.props.family.id) {
			this.setState(this.setInitialState(nextProps));
		}
	}

	setInitialState = props => {
		return {
			serverSideError: '',
			family: {
				...defaultFamily,
				...props.family,
			},
		};
	};

	onChange = e => {
		this.setState({
			serverSideError: '',
			family: {
				...this.state.family,
				[e.target.id]: e.target.value,
			},
		});
	};
	onSubmit = () => {
		const isCreation = !this.state.family.id;

		this.props.saveFamily(
			this.state.family,
			(err, id = this.state.family.id) => {
				if (!err) {
					goBackOrReplace(this.props, `/operations/family/${id}`, isCreation);
				} else {
					this.setState({
						serverSideError: err,
					});
				}
			}
		);
	};

	render() {
		if (this.props.operationsAsyncTask)
			return <Loading textType="saving" context="operations" />;

		const {
			langs: { lg1, lg2 },
		} = this.props;
		const { family, serverSideError } = this.state;
		const isEditing = !!family.id;

		const errors = validate(family);
		const globalError = errors.errorMessage || serverSideError;

		return (
			<div className="container editor-container">
				{isEditing && (
					<PageTitleBlock
						titleLg1={this.props.family.prefLabelLg1}
						titleLg2={this.props.family.prefLabelLg2}
						secondLang={true}
						context="operations"
					/>
				)}

				<div className="row btn-line">
					<Button
						action={goBack(this.props, '/operations/families')}
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
							style={{ visibility: globalError ? 'visible' : 'hidden' }}
							className="alert alert-danger bold"
							role="alert"
						>
							{globalError || <span style={{ whiteSpace: 'pre-wrap' }}> </span>}
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
								id="prefLabelLg1"
								value={this.state.family.prefLabelLg1}
								onChange={this.onChange}
								aria-invalid={errors.fields.prefLabelLg1}
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
								id="prefLabelLg2"
								value={family.prefLabelLg2}
								onChange={this.onChange}
								aria-invalid={errors.fields.prefLabelLg2}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-6 form-group">
							<label htmlFor="themeLg1">
								<NoteFlag text={D.theme} lang={lg1} />
							</label>
							<input
								type="text"
								className="form-control"
								id="themeLg1"
								value={family.themeLg1}
								onChange={this.onChange}
							/>
						</div>
						<div className="col-md-6 form-group">
							<label htmlFor="themeLg2">
								<NoteFlag text={D.theme} lang={lg2} />
							</label>
							<input
								type="text"
								className="form-control"
								id="themeLg2"
								value={family.themeLg2}
								onChange={this.onChange}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-6 form-group">
							<label htmlFor="abstractLg1">
								<NoteFlag text={D.summary} lang={lg1} />
							</label>
							<EditorMarkdown
								text={family.abstractLg1}
								handleChange={value =>
									this.onChange({ target: { value, id: 'abstractLg1' } })
								}
							/>
						</div>
						<div className="col-md-6 form-group">
							<label htmlFor="abstractLg2">
								<NoteFlag text={D.summary} lang={lg2} />
							</label>
							<EditorMarkdown
								text={family.abstractLg2}
								handleChange={value =>
									this.onChange({ target: { value, id: 'abstractLg2' } })
								}
							/>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default OperationsFamilyEdition;
