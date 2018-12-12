import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import Field from 'js/components/operations/msd/pages/sims-creation/sims-field';
import Button from 'js/components/shared/button';
import { flattenTree } from 'js/utils/msd';
import ReactLoading from 'react-loading';

import CheckSecondLang from 'js/components/shared/second-lang-checkbox';

class SimsCreation extends React.Component {
	static propTypes = {
		metadataStructure: PropTypes.object.isRequired,
		codesLists: PropTypes.object.isRequired,
		sims: PropTypes.object,
		onSubmit: PropTypes.func.isRequired,
		goBack: PropTypes.func,
	};

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		const { metadataStructure, sims = {} } = this.props;
		const flattenStructure = flattenTree(metadataStructure);
		this.state = {
			saving: false,
			sims: {
				...Object.keys(flattenStructure).reduce((acc, key) => {
					return {
						...acc,
						[key]: {
							rangeType: flattenStructure[key].rangeType,
							idAttribute: key,
							value: '',
							labelLg1: '',
							labelLg2: '',
						},
					};
				}, {}),
				...sims.rubrics,
			},
		};
	}

	handleChange(e) {
		this.setState(state => ({
			...state,
			sims: {
				...state.sims,
				[e.id]: {
					...state.sims[e.id],
					...e.override,
				},
			},
		}));
	}
	handleSubmit(e) {
		e.preventDefault();
		e.stopPropagation();
		this.setState({ saving: true });
		this.props.onSubmit(
			{
				id: this.props.sims.id,
				labelLg1: this.props.sims.labelLg1,
				labelLg2: this.props.sims.labelLg2,
				idOperation: this.props.idOperation || this.props.sims.idOperation,
				rubrics: Object.values(this.state.sims),
			},
			id => {
				this.setState({ saving: false });
				this.props.goBack(`/operations/sims/${id}`);
			}
		);
	}

	render() {
		const {
			metadataStructure,
			codesLists,
			saveSecondLang,
			secondLang,
			goBack,
			idOperation,
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
								{displayContent(children[id].children, handleChange)}
							</div>
						);
					})}
				</React.Fragment>
			);
		}
		if (this.state.saving)
			return (
				<div className="loading-operations">
					<ReactLoading
						type="spinningBubbles"
						delay={0}
						height="50%"
						width="50%"
					/>
				</div>
			);

		return (
			<form>
				<div className="row btn-line">
					<Button
						col={3}
						action={() =>
							goBack(
								this.props.sims.id
									? `/operations/sims/${this.props.sims.id}`
									: `/operations/operation/${idOperation}`
							)
						}
						label={
							<React.Fragment>
								<span
									className="glyphicon glyphicon-floppy-disk"
									aria-hidden="true"
								/>
								<span> {D.btnCancel}</span>
							</React.Fragment>
						}
						context="operations"
					/>
					<div className="col-md-6" />
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

				{Object.values(metadataStructure).map((msd, index) => {
					return (
						<div key={msd.idMas}>
							{index === 0 && (
								<CheckSecondLang
									secondLang={secondLang}
									onChange={saveSecondLang}
								/>
							)}
							<div className="panel panel-default">
								<div className="panel-heading">
									<h2 id={msd.idMas} className="titre-principal">
										{msd.idMas} - {msd.masLabelLg1}
									</h2>
								</div>
								<div className="panel-body">
									<Field
										msd={msd}
										currentSection={sims[msd.idMas]}
										handleChange={this.handleChange}
										codesLists={codesLists}
										secondLang={secondLang}
									/>
								</div>
							</div>
							{displayContent(msd.children, this.handleChange)}
						</div>
					);
				})}
			</form>
		);
	}
}

export default SimsCreation;
