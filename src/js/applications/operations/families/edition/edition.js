import { Component } from 'react';
import { D1, D2 } from 'js/i18n';
import {
	EditorMarkdown,
	PageTitleBlock,
	withTitle,
	ErrorBloc,
	GlobalClientSideErrorBloc,
	ClientSideError,
	Row,
} from 'js/utils';
import { Loading } from 'js/new-architecture/components/loading/loading';

import {
	CancelButton,
	SaveButton,
	ActionToolbar,
	LabelRequired,
} from '@inseefr/wilco';
import { validate } from './validation';
import D from '../../../../i18n/build-dictionary';
import api from '../../../../remote-api/operations-api';
import { TextInput } from '../../../../new-architecture/components';

const defaultFamily = {
	prefLabelLg1: '',
	prefLabelLg2: '',
	themeLg1: '',
	themeLg2: '',
	abstractLg1: '',
	abstractLg2: '',
};

const setInitialState = (props) => {
	return {
		clientSideErrors: {},
		serverSideError: '',
		saving: false,
		submitting: false,
		family: {
			...defaultFamily,
			...props.family,
		},
	};
};
class OperationsFamilyEdition extends Component {
	constructor(props) {
		super(props);
		this.state = setInitialState(props);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.id !== prevState.family.id) {
			return setInitialState(nextProps);
		} else return null;
	}

	onChange = (e) => {
		this.setState((state) => ({
			serverSideError: '',
			submitting: true,
			clientSideErrors: {
				...state.clientSideErrors,
				errorMessage: [],
			},
			family: {
				...this.state.family,
				[e.target.id]: e.target.value,
			},
		}));
	};
	onSubmit = () => {
		const clientSideErrors = validate(this.state.family);
		if (clientSideErrors.errorMessage?.length > 0) {
			this.setState({
				submitting: true,
				clientSideErrors,
			});
		} else {
			this.setState({ saving: true });
			const isCreation = !this.state.family.id;

			const method = isCreation ? 'createFamily' : 'updateFamily';
			return api[method](this.state.family)
				.then(
					(id = this.state.family.id) => {
						this.props.goBack(`/operations/family/${id}`, isCreation);
					},
					(err) => {
						this.setState({
							serverSideError: err,
						});
					}
				)
				.finally(() => this.setState({ saving: false }));
		}
	};

	render() {
		if (this.state.saving) return <Loading textType="saving" />;

		const { goBack } = this.props;
		const { family, serverSideError } = this.state;
		const isEditing = !!family.id;

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
					<CancelButton action={() => goBack('/operations/families')} />
					<SaveButton
						action={this.onSubmit}
						disabled={this.state.clientSideErrors.errorMessage?.length > 0}
					/>
				</ActionToolbar>

				{this.state.submitting && this.state.clientSideErrors && (
					<GlobalClientSideErrorBloc
						clientSideErrors={this.state.clientSideErrors.errorMessage}
						D={D}
					/>
				)}
				{serverSideError && <ErrorBloc error={[serverSideError]} D={D} />}

				<form>
					<Row>
						<div className="col-md-6 form-group">
							<LabelRequired htmlFor="prefLabelLg1">{D1.title}</LabelRequired>
							<TextInput
								id="prefLabelLg1"
								value={this.state.family.prefLabelLg1}
								onChange={this.onChange}
								aria-invalid={
									!!this.state.clientSideErrors.fields?.prefLabelLg1
								}
								aria-describedby={
									!!this.state.clientSideErrors.fields?.prefLabelLg1
										? 'prefLabelLg1-error'
										: null
								}
							/>
							<ClientSideError
								id="prefLabelLg1-error"
								error={this.state.clientSideErrors?.fields?.prefLabelLg1}
							></ClientSideError>
						</div>
						<div className="col-md-6 form-group">
							<LabelRequired htmlFor="prefLabelLg2">{D2.title}</LabelRequired>
							<TextInput
								id="prefLabelLg2"
								value={family.prefLabelLg2}
								onChange={this.onChange}
								aria-invalid={
									!!this.state.clientSideErrors.fields?.prefLabelLg2
								}
								aria-describedby={
									!!this.state.clientSideErrors.fields?.prefLabelLg2
										? 'prefLabelLg2-error'
										: null
								}
							/>
							<ClientSideError
								id="prefLabelLg2-error"
								error={this.state.clientSideErrors?.fields?.prefLabelLg2}
							></ClientSideError>
						</div>
					</Row>
					<Row>
						<div className="col-md-6 form-group">
							<label htmlFor="themeLg1">{D1.theme}</label>
							<TextInput
								id="themeLg1"
								value={family.themeLg1}
								onChange={this.onChange}
							/>
						</div>
						<div className="col-md-6 form-group">
							<label htmlFor="themeLg2">{D2.theme}</label>
							<TextInput
								id="themeLg2"
								value={family.themeLg2}
								onChange={this.onChange}
							/>
						</div>
					</Row>
					<Row>
						<div className="col-md-6 form-group">
							<label htmlFor="abstractLg1">{D1.summary}</label>
							<EditorMarkdown
								text={family.abstractLg1}
								handleChange={(value) =>
									this.onChange({ target: { value, id: 'abstractLg1' } })
								}
							/>
						</div>
						<div className="col-md-6 form-group">
							<label htmlFor="abstractLg2">{D2.summary}</label>
							<EditorMarkdown
								text={family.abstractLg2}
								handleChange={(value) =>
									this.onChange({ target: { value, id: 'abstractLg2' } })
								}
							/>
						</div>
					</Row>
				</form>
			</div>
		);
	}
}

export default withTitle(
	OperationsFamilyEdition,
	D.familiesTitle + ' - ' + D.operationsTitle,
	(props) => {
		return props.family.prefLabelLg1 || D.familiesCreateTitle;
	}
);
