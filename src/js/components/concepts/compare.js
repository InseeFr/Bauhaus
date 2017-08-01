import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import MenuConcepts from './menu';
import ConceptGeneral from './general';
import ConceptCompareNotes from './compare-notes';
import { dictionary } from 'js/utils/dictionary';
import {
  creatSelectList,
  creatSelectListSelectedLast,
} from 'js/utils/array-utils';

class ConceptCompare extends Component {
  constructor(props) {
    super(props);
    const version = Number(this.props.conceptGeneral.conceptVersion);
    this.state = { english: false, select1: version - 1, select2: version };
    this.toggleEnglish = () =>
      this.setState({
        english: !this.state.english,
      });

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
    const { id, conceptGeneral, conceptNotes } = this.props;
    const { english, select1, select2 } = this.state;
    const conceptVersion = Number(conceptGeneral.conceptVersion);

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
                  {conceptGeneral.prefLabelLg1}
                </h2>}
              {english &&
                <h2 className="page-title">
                  <em>
                    {conceptGeneral.prefLabelLg2}{' '}
                  </em>
                </h2>}
            </div>
          </div>
          <div className="row btn-line">
            <div className="col-md-3">
              <Link
                className="btn btn-primary btn-lg col-md-12"
                to={`/concept/${id}`}>
                {dictionary.buttons.returnCurrent}
              </Link>
            </div>
          </div>
          <ConceptGeneral attr={conceptGeneral} />
          <div className="row">
            <div className="col-md-6 centered">
              <h3>
                {' '}{dictionary.concept.version} :{' '}
                <select
                  value={this.state.select1}
                  onChange={e => this.changeSelect1(e)}>
                  {creatSelectList(conceptVersion)}
                </select>
              </h3>
            </div>
            <div className="col-md-6 centered">
              <h3>
                {' '}{dictionary.concept.version} :{' '}
                <select
                  value={this.state.select2}
                  onChange={e => this.changeSelect2(e)}>
                  {creatSelectListSelectedLast(conceptVersion)}
                </select>
              </h3>
            </div>
            <ConceptCompareNotes
              english={english}
              conceptGeneral={conceptGeneral}
              notesVersion1={conceptNotes[select1]}
              notesVersion2={conceptNotes[select2]}
            />
          </div>
        </div>
      </div>
    );
  }
}

ConceptCompare.propTypes = {
  id: PropTypes.string.isRequired,
  conceptGeneral: generalPropTypes,
  // conceptNotes : {0:{definitionLg1:'XXX'}}
  conceptNotes: PropTypes.object.isRequired,
};

export default ConceptCompare;
