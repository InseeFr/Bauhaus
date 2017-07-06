import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
    const { match: { params: { id } } } = this.props;
    this.state = {
      english: false,
      conceptsToValid: [{ id }],
      validation: 'WAITING',
      id,
    };

    this.toggleEnglish = () =>
      this.setState({
        english: !this.state.english,
      });

    this.handleClickReturn = e => {
      e.preventDefault();
      this.props.history.push('/concepts');
    };

    this.handleClickSend = e => {
      e.preventDefault();
      this.props.history.push('/concept/' + this.state.id + '/send');
    };

    this.handleClickCompare = e => {
      e.preventDefault();
      this.props.history.push('/concept/' + this.state.id + '/compare');
    };

    this.handleClickModif = e => {
      e.preventDefault();
      this.props.history.push('/concept/' + this.state.id + '/modify');
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
          this.props.loadConceptGeneralAndNotes(this.state.id);
        })
        .then(() => {
          this.setState({
            validation: 'DONE',
          });
          this.props.history.push('/concept/' + this.state.id);
        });
    };
  }

  componentWillMount() {
    const { id } = this.state;
    this.props.loadConceptGeneralAndNotes(id);
    this.props.loadConceptLinks(id);
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params: { id: nextId } } } = nextProps;
    const { id } = this.state;
    this.setState();
    if (id !== nextId) {
      this.props.loadConceptGeneralAndNotes(nextId);
      this.props.loadConceptLinks(nextId);
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

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { id } } } = ownProps;
  return {
    conceptGeneral: state.conceptGeneral[id],
    conceptNotes: state.conceptNotes[id],
    conceptLinks: state.conceptLinks[id],
  };
};

const mapDispatchToProps = {
  loadConceptGeneralAndNotes,
  loadConceptLinks,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(ConceptsByID)
);
