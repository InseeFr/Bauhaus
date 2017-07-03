import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import MenuConcepts from './menu-concepts';
import Loadable from 'react-loading-overlay';
import ConceptByIDButtons from './concept-by-id-buttons';
import ConceptGeneral from './concept-general';
import ConceptLinks from './concept-links';
import ConceptNotes from './concept-notes';
import {
  loadConceptGeneralAndNotes,
  loadConceptLinks,
} from '../actions/concept-by-id';
import { dictionary } from '../utils/dictionary';
import { postConceptsToValidate } from '../utils/remote-api';

class ConceptsByID extends Component {
  constructor(props) {
    super(props);
    this.state = {
      english: false,
      conceptsToValid: [{ id: this.props.params.id }],
      validation: 'WAITING',
    };

    this.toggleEnglish = () =>
      this.setState({
        english: !this.state.english,
      });

    this.handleClickReturn = e => {
      e.preventDefault();
      hashHistory.push('/concepts');
    };

    this.handleClickSend = e => {
      e.preventDefault();
      hashHistory.push('/concept/' + this.props.params.id + '/send');
    };

    this.handleClickCompare = e => {
      e.preventDefault();
      hashHistory.push('/concept/' + this.props.params.id + '/compare');
    };

    this.handleClickModif = e => {
      e.preventDefault();
      hashHistory.push('/concept/' + this.props.params.id + '/modify');
    };

    this.handleClickValid = e => {
      e.preventDefault();
      const data = {
        conceptsToValid: this.state.conceptsToValid,
      };
      this.setState({
        validation: 'PENDING',
      });
      postConceptsToValidate(data)
        .then(() => {
          this.props.loadConceptGeneralAndNotes(this.props.params.id);
        })
        .then(() => {
          this.setState({
            validation: 'DONE',
          });
          hashHistory.push('/concept/' + this.props.params.id);
        });
    };
  }

  componentWillMount() {
    this.props.loadConceptGeneralAndNotes(this.props.params.id);
    this.props.loadConceptLinks(this.props.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      this.props.loadConceptGeneralAndNotes(nextProps.params.id);
      this.props.loadConceptLinks(nextProps.params.id);
    }
  }

  render() {
    const { conceptGeneral, conceptLinks, conceptNotes } = this.props;
    const { english, validation } = this.state;
    if (!conceptGeneral || !conceptLinks || !conceptNotes) return null;

    if (validation === 'PENDING') {
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
                {conceptGeneral.prefLabelFr}
              </h2>
            </div>
          </div>
          <ConceptByIDButtons
            attr={conceptGeneral}
            onClickReturn={this.handleClickReturn}
            onClickSend={this.handleClickSend}
            onClickCompare={this.handleClickCompare}
            onClickModif={this.handleClickModif}
            onClickValid={this.handleClickValid}
          />
          {english &&
            <div className="row">
              <div className="col-md-10 centered col-md-offset-1">
                <h2>
                  <em>
                    {conceptGeneral.prefLabelEn}
                  </em>
                </h2>
              </div>
            </div>}
          <ConceptGeneral attr={conceptGeneral} english={english} />
          {conceptLinks.length > 0 &&
            <ConceptLinks english={english} links={conceptLinks} />}
          {conceptNotes[conceptGeneral.conceptVersion] &&
            <ConceptNotes
              english={english}
              attr={conceptNotes[conceptGeneral.conceptVersion]}
            />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  conceptGeneral: state.conceptGeneral[ownProps.params.id],
  conceptNotes: state.conceptNotes[ownProps.params.id],
  conceptLinks: state.conceptLinks[ownProps.params.id],
});

const mapDispatchToProps = {
  loadConceptGeneralAndNotes,
  loadConceptLinks,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConceptsByID);
