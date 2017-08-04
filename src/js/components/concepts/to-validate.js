import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Loadable from 'react-loading-overlay';
import ConceptsPicker from './picker';
import { VALIDATE_CONCEPT_LIST } from 'js/actions/constants';
import { dictionary } from 'js/utils/dictionary';
import * as select from 'js/reducers';
import validateConceptList from 'js/actions/concepts/validate';
import loadConceptValidateList from 'js/actions/concepts/validate-list';
import { OK } from 'js/constants';

class ConceptsToValidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validationRequested: false,
    };

    this.handleValidateConceptList = ids => {
      this.props.validateConceptList(ids);
      this.setState({
        validationRequested: true,
      });
    };
  }
  componentWillMount() {
    if (!this.props.concepts) this.props.loadConceptValidateList();
  }
  render() {
    const { validationRequested } = this.state;
    const { validationStatus } = this.props;
    if (validationRequested) {
      if (validationStatus === OK) {
        return <Redirect to="/concepts" />;
      } else {
        return (
          <Loadable
            active={true}
            spinner
            text={dictionary.loadable.loading}
            color="#457DBB"
            background="grey"
            spinnerSize="400px"
          />
        );
      }
    }
    const { concepts } = this.props;
    if (!concepts)
      return (
        <Loadable
          active={true}
          spinner
          text={dictionary.loadable.loading}
          color="#457DBB"
          background="grey"
          spinnerSize="400px"
        />
      );
    return (
      <ConceptsPicker
        concepts={concepts}
        title={dictionary.concepts.validation.title}
        panelTitle={dictionary.concepts.validation.panel}
        labelLoadable={dictionary.loadable.validation}
        labelWarning={dictionary.warning.validation.concepts}
        labelValidateButton={dictionary.buttons.validate}
        handleAction={this.handleValidateConceptList}
      />
    );
  }
}

const mapStateToProps = state => ({
  concepts: select.getConceptValidateList(state),
  validationStatus: select.getStatus(state, VALIDATE_CONCEPT_LIST),
});

const mapDispatchToProps = {
  loadConceptValidateList,
  validateConceptList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConceptsToValidate);
