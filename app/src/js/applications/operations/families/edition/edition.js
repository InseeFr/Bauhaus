import React, { Component } from 'react';
import { D1, D2 } from 'js/i18n';
import PropTypes from 'prop-types';
import { EditorMarkdown, PageTitleBlock, withTitle, ErrorBloc } from 'bauhaus-utilities';
import {
	CancelButton,
	SaveButton,
	Loading,
	ActionToolbar,
	goBackOrReplace,
	goBack,
	LabelRequired,
} from '@inseefr/wilco';
import { validate } from './validation';
import D from '../../../../i18n/build-dictionary';
import { withRouter } from 'react-router-dom';
import api from '../../../../remote-api/operations-api';

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
		saving: false,
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
	};

	constructor(props) {
		super(props);
		this.state = setInitialState(props);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.id !== prevState.family.id) {
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
		this.setState({ saving: true })
		const isCreation = !this.state.family.id;

		const method = isCreation ? 'postFamily' : 'putFamily';
		return api[method](this.state.family).then(
			(id = this.state.family.id) => {
				goBackOrReplace(this.props, `/operations/family/${id}`, isCreation);
			},
			err => {
				this.setState({
					serverSideError: err,
				});
			}
		).finally(() => this.setState({ saving: false }));
	};

	render() {
		if (this.state.saving) return <Loading textType="saving" />;

		const { family, serverSideError } = this.state;
		const isEditing = !!family.id;

		const clientSideErrors = validate(family);

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
					<SaveButton action={this.onSubmit} disabled={clientSideErrors.errorMessage.length > 0} />
				</ActionToolbar>

				{ clientSideErrors && <ErrorBloc error={clientSideErrors.errorMessage} D={D}/> }
				{ serverSideError && <ErrorBloc error={[serverSideError]} D={D}/> }

				<form>
					<div className="row">
						<div className="col-md-6 form-group">
							<LabelRequired htmlFor="prefLabelLg1">{D1.title}</LabelRequired>
							<input
								type="text"
								className="form-control"
								id="prefLabelLg1"
								value={this.state.family.prefLabelLg1}
								onChange={this.onChange}
								aria-invalid={clientSideErrors.fields.prefLabelLg1}
							/>
						</div>
						<div className="col-md-6 form-group">
							<LabelRequired htmlFor="prefLabelLg2">{D2.title}</LabelRequired>
							<input
								type="text"
								className="form-control"
								id="prefLabelLg2"
								value={family.prefLabelLg2}
								onChange={this.onChange}
								aria-invalid={clientSideErrors.fields.prefLabelLg2}
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

export default withTitle(withRouter(OperationsFamilyEdition), D.operationsTitle, props => {
	return props.family.prefLabelLg1 || D.familiesCreateTitle
});
