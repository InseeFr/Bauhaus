import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Redirect } from 'react-router-dom';
import MenuConcepts from '../menu-concepts';
import Loadable from 'react-loading-overlay';
import ConceptDetailsContainer from './concept-details-container';
import ConceptVisualizationControls from '../concept-visualization-controls';
import ConceptGeneral from '../concept-general';
import ConceptLinks from '../concept-links';
import ConceptNotes from '../concept-notes';
import { dictionary } from 'js/utils/dictionary';
import { validateConcepts } from 'js/actions/concepts-to-validate';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import { propTypes as notePropTypes } from 'js/utils/concepts/notes';
import { propTypes as conceptsWithLinksPropTypes } from 'js/utils/concepts/links';
import { PENDING, OK } from 'js/constants';
import buildExtract from 'js/utils/build-extract';

const extractId = buildExtract('id');

//TODO introduce a container component
class ConceptVisualizationPres extends Component {
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
      this.props.validateConcept([this.props.id]);
    };
  }

  render() {
    const {
      id,
      isValidationProcessed,
      general,
      conceptsWithLinks,
      notes,
    } = this.props;
    const { english, validationRequested } = this.state;
    if (validationRequested) {
      if (isValidationProcessed === OK) {
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
                {general.prefLabelFr}
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
                    {general.prefLabelEn}
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

ConceptVisualizationPres.propTypes = {
  id: PropTypes.string, // not available for creation
  general: generalPropTypes.isRequired,
  notes: notePropTypes.isRequired,
  conceptsWithLinks: conceptsWithLinksPropTypes.isRequired,
  stampsList: PropTypes.array.isRequired,
  disseminationStatusList: PropTypes.array.isRequired,
  validateConcept: PropTypes.func.isRequired,
  // PENDNG if a validation has been sent and is not done yet, OK otherwise
  isValidationProcessed: PropTypes.oneOf([PENDING, OK]).isRequired,
};

export default props => {
  const id = extractId(props);
  return (
    <ConceptDetailsContainer
      id={id}
      handleAction={validateConcepts}
      statusPropName="validation">
      {({
        general,
        notes,
        conceptsWithLinks,
        stampsList,
        disseminationStatusList,
        handleAction,
        trackAction,
      }) =>
        <ConceptVisualizationPres
          id={id}
          general={general}
          notes={notes}
          conceptsWithLinks={conceptsWithLinks}
          stampsList={stampsList}
          disseminationStatusList={disseminationStatusList}
          validateConcept={handleAction}
          isValidationProcessed={trackAction}
        />}
    </ConceptDetailsContainer>
  );
};
