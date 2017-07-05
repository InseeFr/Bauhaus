import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import MenuConcepts from './menu-concepts';
import ConceptGeneral from './concept-general';
import ConceptCompareNotes from './concept-compare-notes';
import { dictionary } from '../utils/dictionary';
import {
  creatSelectList,
  creatSelectListSelectedLast,
} from '../utils/array-utils';
import { loadConceptNotes } from '../actions/concept-by-id';

class ConceptCompare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      english: false,
      select1: this.props.conceptGeneral.conceptVersion - 1,
      select2: this.props.conceptGeneral.conceptVersion,
    };
    console.log(this.state);

    this.toggleEnglish = () =>
      this.setState({
        english: !this.state.english,
      });

    this.handleClick = e => {
      e.preventDefault();
      hashHistory.push('/concept/' + this.props.params.id);
    };

    this.changeSelect1 = e => {
      this.setState({
        select1: e.target.value,
      });
    };
    this.changeSelect2 = e => {
      this.setState({
        select2: e.target.value,
      });
    };
  }

  render() {
    const { conceptGeneral } = this.props;
    const { english } = this.state;
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
              {!english &&
                <h2 className="page-title">
                  {conceptGeneral.prefLabelFr}
                </h2>}
              {english &&
                <h2 className="page-title">
                  <em>
                    {conceptGeneral.prefLabelEn}{' '}
                  </em>
                </h2>}
            </div>
          </div>
          <div className="row btn-line">
            <div className="col-md-3">
              <button
                className="btn btn-primary btn-lg col-md-12"
                onClick={this.handleClick}
              >
                {dictionary.buttons.returnCurrent}
              </button>
            </div>
          </div>
          <ConceptGeneral attr={conceptGeneral} />
          <div className="row">
            <div className="col-md-6 centered">
              <h3>
                {' '}{dictionary.concept.version} :{' '}
                <select
                  defaultValue={conceptGeneral.conceptVersion - 1}
                  onChange={e => this.changeSelect1(e)}
                >
                  {creatSelectList(conceptGeneral.conceptVersion)}
                </select>
              </h3>
            </div>
            <div className="col-md-6 centered">
              <h3>
                {' '}{dictionary.concept.version} :{' '}
                <select
                  defaultValue={conceptGeneral.conceptVersion}
                  onChange={e => this.changeSelect2(e)}
                >
                  {creatSelectListSelectedLast(conceptGeneral.conceptVersion)}
                </select>
              </h3>
            </div>
            <ConceptCompareNotes
              english={english}
              conceptGeneral={conceptGeneral}
              version1={this.state.select1}
              version2={this.state.select2}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  conceptGeneral: state.conceptGeneral[ownProps.params.id],
});

const mapDispatchToProps = {
  loadConceptNotes,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConceptCompare);
