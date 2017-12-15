import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import ConceptVisualizationControls from './visualization-controls';
import ConceptGeneral from './general';
import ConceptLinks from './links';
import ConceptNotes from './notes';
import { dictionary } from 'js/utils/dictionary';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import { propTypes as notePropTypes } from 'js/utils/concepts/notes';
import { propTypesBilingual as linksPropTypes } from 'js/utils/concepts/links';

//TODO introduce a container component
class ConceptVisualization extends Component {
	constructor(props) {
		super(props);
		this.handleClickValid = () => {
			this.props.validateConcept(this.props.id);
		};
	}

	render() {
		const { id, general, links, notes, secondLang } = this.props;

		const { conceptVersion, isValidated } = general;
		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<label className="pull-right">
								<input
									type="checkbox"
									checked={secondLang}
									onChange={this.props.saveSecondLang}
								/>{' '}
								{dictionary.displayLg2}
							</label>
						</div>
					</div>
					<div className="row">
						<div className="col-md-10 centered col-md-offset-1">
							<h2 className="page-title">{general.prefLabelLg1}</h2>
						</div>
					</div>
					{secondLang &&
						general.prefLabelLg2 && (
							<div className="row">
								<div className="col-md-8 centered col-md-offset-2">
									<h3 className="page-sub-title">{general.prefLabelLg2}</h3>
								</div>
							</div>
						)}
					<ConceptVisualizationControls
						id={id}
						//TODO FIX ME
						isValidated={isValidated === 'Validé'}
						conceptVersion={conceptVersion}
						handleValidation={this.handleClickValid}
					/>
					<ConceptGeneral secondLang={secondLang} attr={general} />
					<ConceptLinks secondLang={secondLang} links={links} />
					<ConceptNotes secondLang={secondLang} notes={notes} />
				</div>
			</div>
		);
	}
}

ConceptVisualization.propTypes = {
	id: PropTypes.string, // not available for creation
	general: generalPropTypes.isRequired,
	notes: notePropTypes.isRequired,
	links: linksPropTypes.isRequired,
	stampList: PropTypes.array.isRequired,
	disseminationStatusList: PropTypes.array.isRequired,
	validateConcept: PropTypes.func.isRequired,
};

export default ConceptVisualization;
