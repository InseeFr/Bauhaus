import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';

import { withRouter } from 'react-router-dom';
import Field from 'js/components/operations/msd/msd/visualizations/sims-field';
import Button from 'js/components/shared/button';
import { flattenTree } from 'js/utils/msd';

import CheckSecondLang from 'js/components/shared/second-lang-checkbox';

class SimsForm extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		const { metadataStructure, sims = {} } = this.props;
		const flattenStructure = flattenTree(metadataStructure);
		this.state = {
			sims: {
				...Object.keys(flattenStructure).reduce((acc, key) => {
					return {
						...acc,
						[key]: {
							rangeType: flattenStructure[key].rangeType,
							idAttribute: key,
							value: '',
						},
					};
				}, {}),
				...sims,
			},
		};
	}

	handleChange(e) {
		this.setState({
			sims: {
				...this.state.sims,
				[e.id]: {
					...this.state.sims[e.id],
					...e.override,
				},
			},
		});
	}
	handleSubmit(e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.onSubmit(
			{
				idOperation: this.props.idOperation,
				rubrics: Object.values(this.state.sims),
			},
			id => {
				this.props.history.push(`/operations/sims/${id}`);
			}
		);
	}
	render() {
		const {
			metadataStructure,
			codesLists,
			saveSecondLang,
			secondLang,
		} = this.props;
		const { sims } = this.state;
		function displayContent(children, handleChange) {
			if (Object.keys(children).length <= 0) return null;
			return (
				<React.Fragment>
					{Object.keys(children).map(id => {
						return (
							<div key={id} className="contenu">
								<article id={id} className="panel panel-default">
									<div className="panel-heading">
										<h3>{`${id} - ${children[id].masLabelLg1}`}</h3>
									</div>
									<div className="panel-body">
										<Field
											msd={children[id]}
											currentSection={sims[id]}
											handleChange={handleChange}
											codesLists={codesLists}
											secondLang={secondLang}
										/>
									</div>
								</article>
								{displayContent(children[id].children)}
							</div>
						);
					})}
				</React.Fragment>
			);
		}
		return (
			<form>
				<div className="row btn-line">
					<div className="col-md-9" />
					<Button
						col={3}
						action={this.handleSubmit}
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

				{Object.keys(metadataStructure).map((id, index) => {
					return (
						<div key={id}>
							{index === 0 && (
								<CheckSecondLang
									secondLang={secondLang}
									onChange={saveSecondLang}
								/>
							)}
							<div className="panel panel-default">
								<div className="panel-heading">
									<h2 id={id} className="titre-principal">
										{id} - {metadataStructure[id].masLabelLg1}
									</h2>
								</div>
								<div className="panel-body">
									<Field
										msd={metadataStructure[id]}
										currentSection={sims[id]}
										handleChange={this.handleChange}
										codesLists={codesLists}
										secondLang={secondLang}
									/>
								</div>
							</div>
							{displayContent(
								metadataStructure[id].children,
								this.handleChange
							)}
						</div>
					);
				})}
			</form>
		);
	}
}

SimsForm.propTypes = {
	metadataStructure: PropTypes.object.isRequired,
	currentSection: PropTypes.string,
	codesLists: PropTypes.object.isRequired,
	sims: PropTypes.object.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default withRouter(SimsForm);
