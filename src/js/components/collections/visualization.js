import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import CollectionVisualizationControls from './visualization-controls';
import CollectionGeneral from './general';
import CollectionMembers from './members';
import { dictionary } from 'js/utils/dictionary';
import { propTypes as generalPropTypes } from 'js/utils/collections/general';
import { propTypes as membersPropTypes } from 'js/utils/collections/members';

class CollectionVisualization extends Component {
	constructor(props) {
		super(props);
		this.state = {
			english: false,
		};
		this.toggleEnglish = () =>
			this.setState({
				english: !this.state.english,
			});
		this.handleClickValid = () => {
			this.props.validateCollection(this.props.id);
		};
	}

	render() {
		const { id, general, members } = this.props;
		const { english } = this.state;

		const { isValidated } = general;
		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<label className="pull-right">
								<input
									type="checkbox"
									checked={english}
									onChange={this.toggleEnglish}
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
					{english &&
						general.prefLabelLg2 && (
							<div className="row">
								<div className="col-md-8 centered col-md-offset-2">
									<h3 className="page-sub-title">{general.prefLabelLg2}</h3>
								</div>
							</div>
						)}
					<CollectionVisualizationControls
						id={id}
						//TODO FIX ME
						isValidated={isValidated === 'Validée'}
						handleValidation={this.handleClickValid}
					/>
					<CollectionGeneral attr={general} english={english} />
					<CollectionMembers members={members} english={english} />
				</div>
			</div>
		);
	}
}

CollectionVisualization.propTypes = {
	id: PropTypes.string, // not available for creation
	general: generalPropTypes.isRequired,
	members: membersPropTypes.isRequired,
	stampList: PropTypes.array.isRequired,
	validateCollection: PropTypes.func.isRequired,
};

export default CollectionVisualization;
