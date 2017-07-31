import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Redirect } from 'react-router-dom';
<<<<<<< 2469eef4da15187bfb7b056234fb1c2019f0e2d8:src/js/components/concept-edition/concept-visualization.js
import MenuConcepts from 'js/components/menus/menu-concepts';
import Loadable from 'react-loading-overlay';
import ConceptDetailsContainer from './concept-details-container';
=======
import MenuConcepts from '../menu-concepts';
>>>>>>> Refactor reducers and components for concepts:src/js/components/concepts/visualization.js
import ConceptVisualizationControls from '../concept-visualization-controls';
import ConceptGeneral from '../concept-general';
import ConceptLinks from '../concept-links';
import ConceptNotes from '../concept-notes';
import { dictionary } from 'js/utils/dictionary';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import { propTypes as notePropTypes } from 'js/utils/concepts/notes';
import { propTypes as conceptsWithLinksPropTypes } from 'js/utils/concepts/links';
import { PENDING, OK } from 'js/constants';
import Loadable from 'react-loading-overlay';

//TODO introduce a container component
class ConceptVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      english: false,
      validationRequested: false,
    };
    this.toggleEnglish = () =>
      this.setState({
        english: !this.state.english,
      });
    this.handleClickValid = () => {
      this.setState({
        validationRequested: true,
      });
      this.props.validateConcept(this.props.id);
    };
  }

  render() {
    const {
      id,
      validationStatus,
      general,
      conceptsWithLinks,
      notes,
    } = this.props;
    const { english, validationRequested } = this.state;
    if (validationRequested) {
      if (validationStatus === OK) {
        return <Redirect to={`/concept/${id}`} />;
      } else {
        return (
          <div>
            <MenuConcepts />
            <Loadable
              active={true}
              spinner
              text={dictionary.loadable.validation}
              color="#457DBB"
              background="grey"
              spinnerSize="400px"
            />
          </div>
        );
      }
    }
    const { conceptVersion, isValidated } = general;
    return (
      <div>
        <MenuConcepts />
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
              <h2 className="page-title">
                {general.prefLabelLg1}
              </h2>
            </div>
          </div>
          <ConceptVisualizationControls
            id={id}
            //TODO FIX ME
            isValidated={isValidated === 'Validé'}
            conceptVerions={conceptVersion}
            handleValidation={this.handleClickValid}
          />
          {english &&
            <div className="row">
              <div className="col-md-10 centered col-md-offset-1">
                <h2>
                  <em>
                    {general.prefLabelLg2}
                  </em>
                </h2>
              </div>
            </div>}
          <ConceptGeneral attr={general} english={english} />
          <ConceptLinks english={english} links={conceptsWithLinks} />
          <ConceptNotes english={english} notes={notes} />
        </div>
      </div>
    );
  }
}

ConceptVisualization.propTypes = {
  id: PropTypes.string, // not available for creation
  general: generalPropTypes.isRequired,
  notes: notePropTypes.isRequired,
  conceptsWithLinks: conceptsWithLinksPropTypes.isRequired,
  stampList: PropTypes.array.isRequired,
  disseminationStatusList: PropTypes.array.isRequired,
  validateConcept: PropTypes.func.isRequired,
  // PENDNG if a validation has been sent and is not done yet, OK otherwise
  validationStatus: PropTypes.oneOf([PENDING, OK]).isRequired,
};

export default ConceptVisualization;
