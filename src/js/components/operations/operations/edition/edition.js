import React, { Component } from 'react';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import PageSubtitle from 'js/components/shared/page-subtitle';
import PageTitle from 'js/components/shared/page-title';
import D from 'js/i18n';
import { goBack } from 'js/utils/redirection';
import NoteFlag from 'js/components/shared/note-flag';
import PropTypes from 'prop-types';

const defaultOperation = {
	prefLabelLg1: '',
	prefLabelLg2: '',
	altLabel1: '',
	altLabel2: '',
	millesime: '',
};
class OperationsOperationEdition extends Component {
	constructor(props) {
		super(props);
		this.state = {
			operation: {
				...defaultOperation,
				...props.operation,
			},
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			operation: {
				...defaultOperation,
				...nextProps.operation,
			},
		});
	}
	onChange(e) {
		this.setState({
			operation: {
				...this.state.operation,
				[e.target.id]: e.target.value,
			},
		});
	}
	onSubmit() {
		this.props.saveOperation(this.state.operation);
		goBack(this.props, '/operations/operation/' + this.props.operation.id)();
	}

	render() {
		const {
			secondLang,
			langs: { lg1, lg2 },
			saveSecondLang,
		} = this.props;

		const { operation } = this.state;
		const cl = secondLang ? 'col-md-6' : 'col-md-12';
		return (
			<div className="container">
				<CheckSecondLang secondLang={secondLang} onChange={saveSecondLang} />
				<button
					onClick={this.onSubmit}
					type="button"
					className="btn btn-success btn-lg pull-right"
				>
					{D.btnValid}
				</button>

				<div className="row">
					<div className="col-md-2">
						<button
							className="btn btn-primary btn-lg col-md-12"
							onClick={goBack(this.props, '/operations/families')}
						>
							{D.btnReturn}
						</button>
					</div>
				</div>
				<PageTitle
					title={this.props.operation.prefLabelLg1}
					context="operations"
					col="12"
					offset="0"
				/>
				{secondLang &&
					operation.prefLabelLg2 && (
						<PageSubtitle subTitle={this.props.operation.prefLabelLg2} />
					)}
				<form>
					<div className={cl}>
						<div className="form-group">
							<label htmlFor="prefLabelLg1">
								<NoteFlag text={D.title} lang={lg1} />
							</label>
							<input
								type="text"
								className="form-control input-lg"
								id="prefLabelLg1"
								value={this.state.operation.prefLabelLg1}
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="altLabel1">
								<NoteFlag text={D.altLabelTitle} lang={lg1} />
							</label>
							<input
								type="text"
								className="form-control input-lg"
								id="altLabel1"
								value={operation.altLabel1}
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="millesime">
								<NoteFlag text={D.year} lang={lg1} />
							</label>
							<textarea
								value={operation.millesime}
								className="form-control"
								id="millesime"
								rows="10"
								onChange={this.onChange}
							/>
						</div>
					</div>
					{secondLang && (
						<div className="col-md-6">
							<div className="form-group">
								<label htmlFor="prefLabelLg2">
									<NoteFlag text={D.title} lang={lg2} />
								</label>
								<input
									type="text"
									className="form-control input-lg"
									id="prefLabelLg2"
									value={operation.prefLabelLg2}
									onChange={this.onChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="altLabel2">
									<NoteFlag text={D.altLabelTitle} lang={lg2} />
								</label>
								<input
									type="text"
									className="form-control input-lg"
									id="altLabel2"
									value={operation.altLabel2}
									onChange={this.onChange}
								/>
							</div>
						</div>
					)}
				</form>
			</div>
		);
	}
}

OperationsOperationEdition.propTypes = {
	operation: PropTypes.object.isRequired,
	langs: PropTypes.object.isRequired,
	saveSecondLang: PropTypes.func.isRequired,
	saveOperation: PropTypes.func.isRequired,
};

export default OperationsOperationEdition;
