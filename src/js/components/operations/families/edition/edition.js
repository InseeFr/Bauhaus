import React, { Component } from 'react';
import PageSubtitle from 'js/components/shared/page-subtitle';
import PageTitle from 'js/components/shared/page-title';
import D from 'js/i18n';
import { goBack } from 'js/utils/redirection';
import NoteFlag from 'js/components/shared/note-flag';
import PropTypes from 'prop-types';
import EditorMarkdown from 'js/components/shared/editor-markdown';
import Button from 'js/components/shared/button';

const defaultFamily = {
	prefLabelLg1: '',
	prefLabelLg2: '',
	themeLg1: '',
	themeLg2: '',
	abstractLg1: '',
	abstractLg2: '',
};
class OperationsFamilyEdition extends Component {
	constructor(props) {
		super(props);
		this.state = {
			family: {
				...defaultFamily,
				...props.family,
			},
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			family: {
				...defaultFamily,
				...nextProps.family,
			},
		});
	}
	onChange(e) {
		this.setState({
			family: {
				...this.state.family,
				[e.target.id]: e.target.value,
			},
		});
	}
	onSubmit() {
		this.props.saveFamily(this.state.family);
		goBack(this.props, '/operations/families/' + this.props.family.id)();
	}

	render() {
		const {
			langs: { lg1, lg2 },
		} = this.props;
		const { family } = this.state;

		return (
			<div className="container editor-container">
				<PageTitle
					title={this.props.family.prefLabelLg1}
					context="operations"
				/>
				{family.prefLabelLg2 && (
					<PageSubtitle
						subTitle={this.props.family.prefLabelLg2}
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

					<div className="col-md-8 centered" />
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
					/>
				</div>
				<form>
					<div className="row">
						<div className="col-md-6">
							<div className="form-group">
								<label htmlFor="prefLabelLg1">
									<NoteFlag text={D.title} lang={lg1} />
								</label>
								<input
									type="text"
									className="form-control"
									id="prefLabelLg1"
									value={this.state.family.prefLabelLg1}
									onChange={this.onChange}
									disabled
								/>
							</div>
						</div>
						<div className="col-md-6">
							<div className="form-group">
								<label htmlFor="prefLabelLg2">
									<NoteFlag text={D.title} lang={lg2} />
								</label>
								<input
									type="text"
									className="form-control"
									id="prefLabelLg2"
									value={family.prefLabelLg2}
									onChange={this.onChange}
									disabled
								/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-6">
							<div className="form-group">
								<label htmlFor="themeLg1">
									<NoteFlag text={D.theme} lang={lg1} />
								</label>
								<input
									disabled
									type="text"
									className="form-control"
									id="themeLg1"
									value={family.themeLg1}
									onChange={this.onChange}
								/>
							</div>
						</div>
						<div className="col-md-6">
							<div className="form-group">
								<label htmlFor="themeLg2">
									<NoteFlag text={D.theme} lang={lg2} />
								</label>
								<input
									disabled
									type="text"
									className="form-control"
									id="themeLg2"
									value={family.themeLg2}
									onChange={this.onChange}
								/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-6">
							<div className="form-group">
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
						</div>
						<div className="col-md-6">
							<div className="form-group">
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
					</div>
				</form>
			</div>
		);
	}
}

OperationsFamilyEdition.propTypes = {
	family: PropTypes.object.isRequired,
	langs: PropTypes.object.isRequired,
	saveFamily: PropTypes.func.isRequired,
};

export default OperationsFamilyEdition;
