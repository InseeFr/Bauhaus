import React, { Component } from 'react';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import PageSubtitle from 'js/components/shared/page-subtitle';
import PageTitle from 'js/components/shared/page-title';
import D from 'js/i18n';
import { goBack } from 'js/utils/redirection';
import NoteFlag from 'js/components/shared/note-flag';
import PropTypes from 'prop-types';

const defaultFamily = {
	prefLabelLg1: '',
	prefLabelLg2: '',
	themeLg1: '',
	themeLg2: '',
	descriptionLg1: '',
	descriptionLg2: '',
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
		const { secondLang, langs: { lg1, lg2 }, saveSecondLang } = this.props;

		const { family } = this.state;
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
					title={this.props.family.prefLabelLg1}
					context="operations"
					col="12"
					offset="0"
				/>
				{secondLang &&
					family.prefLabelLg2 && (
						<PageSubtitle subTitle={this.props.family.prefLabelLg2} />
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
								value={this.state.family.prefLabelLg1}
								onChange={this.onChange}
								disabled
							/>
						</div>
						<div className="form-group">
							<label htmlFor="themeLg1">
								<NoteFlag text={D.theme} lang={lg1} />
							</label>
							<input
								type="text"
								className="form-control input-lg"
								id="themeLg1"
								value={family.themeLg1}
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="descriptionLg1">
								<NoteFlag text={D.descriptionTitle} lang={lg1} />
							</label>
							<textarea
								value={family.descriptionLg1}
								className="form-control"
								id="descriptionLg1"
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
									value={family.prefLabelLg2}
									onChange={this.onChange}
									disabled
								/>
							</div>
							<div className="form-group">
								<label htmlFor="themeLg2">
									<NoteFlag text={D.theme} lang={lg2} />
								</label>
								<input
									type="text"
									className="form-control input-lg"
									id="themeLg2"
									value={family.themeLg2}
									onChange={this.onChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="descriptionLg2">
									<NoteFlag text={D.descriptionTitle} lang={lg2} />
								</label>
								<textarea
									value={family.descriptionLg2}
									className="form-control"
									id="descriptionLg2"
									rows="10"
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

OperationsFamilyEdition.propTypes = {
	family: PropTypes.object.isRequired,
	langs: PropTypes.object.isRequired,
	saveSecondLang: PropTypes.func.isRequired,
	saveFamily: PropTypes.func.isRequired,
};

export default OperationsFamilyEdition;
