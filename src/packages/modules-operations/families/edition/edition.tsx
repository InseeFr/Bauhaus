import { Component } from 'react';

import { ActionToolbar } from '@components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '@components/buttons/buttons-with-icons';
import {
	ClientSideError,
	ErrorBloc,
	GlobalClientSideErrorBloc,
} from '@components/errors-bloc';
import { TextInput } from '@components/form/input';
import LabelRequired from '@components/label-required';
import { Row } from '@components/layout';
import { Saving } from '@components/loading';
import { PageTitleBlock } from '@components/page-title-block';
import { EditorMarkdown } from '@components/rich-editor/editor-markdown';

import { OperationsApi } from '@sdk/operations-api';

import { D1, D2 } from '../../../deprecated-locales';
import D from '../../../deprecated-locales/build-dictionary';
import { Family } from '../../../model/operations/family';
import { validate } from './validation';

const defaultFamily = {
	prefLabelLg1: '',
	prefLabelLg2: '',
	themeLg1: '',
	themeLg2: '',
	abstractLg1: '',
	abstractLg2: '',
};

interface OperationsFamilyEditionProps {
	id: string;
	family: Family;
	goBack: (url: string, replace?: boolean) => void;
}
interface OperationsFamilyEditionState {
	family: Family;
	clientSideErrors: {
		errorMessage: string[];
		fields?: Record<string, string>;
	};
	serverSideError: string;
	submitting: boolean;
	saving?: boolean;
}
const setInitialState = (
	props: OperationsFamilyEditionProps,
): OperationsFamilyEditionState => {
	return {
		clientSideErrors: {
			errorMessage: [],
		},
		serverSideError: '',
		saving: false,
		submitting: false,
		family: {
			...defaultFamily,
			...props.family,
		},
	};
};
class OperationsFamilyEdition extends Component<
	OperationsFamilyEditionProps,
	OperationsFamilyEditionState
> {
	constructor(props: OperationsFamilyEditionProps) {
		super(props);
		this.state = setInitialState(props);
	}

	static getDerivedStateFromProps(
		nextProps: OperationsFamilyEditionProps,
		prevState: OperationsFamilyEditionState,
	) {
		if (nextProps.id !== prevState.family.id) {
			return setInitialState(nextProps);
		} else return null;
	}

	onChange = (target: string) => (value: string) => {
		this.setState((state) => ({
			serverSideError: '',
			submitting: true,
			clientSideErrors: {
				...state.clientSideErrors,
				errorMessage: [],
			},
			family: {
				...state.family,
				[target]: value,
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
			return OperationsApi[method](this.state.family)
				.then(
					(id = this.state.family.id) => {
						this.props.goBack(`/operations/family/${id}`, isCreation);
					},
					(err: string) => {
						this.setState({
							serverSideError: err,
						});
					},
				)
				.finally(() => this.setState({ saving: false }));
		}
	};

	render() {
		if (this.state.saving) return <Saving />;

		const { goBack } = this.props;
		const { family, serverSideError } = this.state;
		const isEditing = !!family.id;

		return (
			<div className="container editor-container">
				{isEditing && (
					<PageTitleBlock
						titleLg1={this.props.family.prefLabelLg1}
						titleLg2={this.props.family.prefLabelLg2}
					/>
				)}

				<ActionToolbar>
					<CancelButton action={() => goBack('/operations/families')} />
					<SaveButton
						action={this.onSubmit}
						disabled={this.state.clientSideErrors.errorMessage.length > 0}
					/>
				</ActionToolbar>

				{this.state.submitting && this.state.clientSideErrors && (
					<GlobalClientSideErrorBloc
						clientSideErrors={this.state.clientSideErrors.errorMessage}
					/>
				)}
				<ErrorBloc error={[serverSideError]} D={D} />

				<form>
					<Row>
						<div className="col-md-6 form-group">
							<LabelRequired htmlFor="prefLabelLg1">{D1.title}</LabelRequired>
							<TextInput
								id="prefLabelLg1"
								value={this.state.family.prefLabelLg1}
								onChange={(e) => this.onChange(e.target.id)(e.target.value)}
								aria-invalid={
									!!this.state.clientSideErrors.fields?.prefLabelLg1
								}
								aria-describedby={
									this.state.clientSideErrors.fields?.prefLabelLg1
										? 'prefLabelLg1-error'
										: undefined
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
								onChange={(e) => this.onChange(e.target.id)(e.target.value)}
								aria-invalid={
									!!this.state.clientSideErrors.fields?.prefLabelLg2
								}
								aria-describedby={
									this.state.clientSideErrors.fields?.prefLabelLg2
										? 'prefLabelLg2-error'
										: undefined
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
								onChange={(e) => this.onChange(e.target.id)(e.target.value)}
							/>
						</div>
						<div className="col-md-6 form-group">
							<label htmlFor="themeLg2">{D2.theme}</label>
							<TextInput
								id="themeLg2"
								value={family.themeLg2}
								onChange={(e) => this.onChange(e.target.id)(e.target.value)}
							/>
						</div>
					</Row>
					<Row>
						<div className="col-md-6 form-group">
							<label htmlFor="abstractLg1">{D1.summary}</label>
							<EditorMarkdown
								text={family.abstractLg1}
								handleChange={this.onChange('abstractLg1')}
							/>
						</div>
						<div className="col-md-6 form-group">
							<label htmlFor="abstractLg2">{D2.summary}</label>
							<EditorMarkdown
								text={family.abstractLg2}
								handleChange={this.onChange('abstractLg2')}
							/>
						</div>
					</Row>
				</form>
			</div>
		);
	}
}

export default OperationsFamilyEdition;
