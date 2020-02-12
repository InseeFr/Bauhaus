import React, { Component } from 'react';
import { D1, D2 } from 'js/i18n';
import { goBackOrReplace, goBack } from '@inseefr/wilco/src/utils/redirection';
import PropTypes from 'prop-types';
import EditorMarkdown from 'js/applications/shared/editor-html/editor-markdown';
import {
	CancelButton,
	SaveButton,
	Loading,
	ErrorBloc,
	ActionToolbar,
} from '@inseefr/wilco';
import { validate } from './validation';
import PageTitleBlock from 'js/applications/shared/page-title-block';

const defaultFamily = {
	prefLabelLg1: '',
	prefLabelLg2: '',
	themeLg1: '',
	themeLg2: '',
	abstractLg1: '',
	abstractLg2: '',
};

const setInitialState = props => {
	return {
		serverSideError: '',
		family: {
			...defaultFamily,
			...props.family,
		},
	};
};
class OperationsFamilyEdition extends Component {
	static propTypes = {
		family: PropTypes.object.isRequired,
		langs: PropTypes.object.isRequired,
		saveFamily: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = setInitialState(props);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.family.id !== prevState.family.id) {
			return setInitialState(nextProps);
		} else return null;
	}

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
		if (this.props.operationsAsyncTask) return <Loading textType="saving" />;

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
					/>
				)}

				<ActionToolbar>
					<CancelButton action={goBack(this.props, '/operations/families')} />

					<SaveButton action={this.onSubmit} disabled={errors.errorMessage} />
				</ActionToolbar>
				<ErrorBloc error={globalError} />

				<form>
					<div className="row">
						<div className="col-md-6 form-group">
							<label htmlFor="prefLabelLg1">
								{D1.title}
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
								{D2.title}
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
							<label htmlFor="themeLg1">{D1.theme}</label>
							<input
								type="text"
								className="form-control"
								id="themeLg1"
								value={family.themeLg1}
								onChange={this.onChange}
							/>
						</div>
						<div className="col-md-6 form-group">
							<label htmlFor="themeLg2">{D2.theme}</label>
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
							<label htmlFor="abstractLg1">{D1.summary}</label>
							<EditorMarkdown
								text={family.abstractLg1}
								handleChange={value =>
									this.onChange({ target: { value, id: 'abstractLg1' } })
								}
							/>
						</div>
						<div className="col-md-6 form-group">
							<label htmlFor="abstractLg2">{D2.summary}</label>
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
