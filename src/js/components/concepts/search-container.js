import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loading-overlay';
import { dictionary } from 'js/utils/dictionary';
import * as select from 'js/reducers';
import ConceptSearchList from './search-list';
import loadStampList from 'js/actions/stamp';
import loadDisseminationStatusList from 'js/actions/dissemination-status';
import loadConceptSearchList from 'js/actions/concepts/search-list';
import 'css/app.css';

class ConceptSearchListContainer extends Component {
  componentWillMount() {
    const {
      conceptSearchList,
      stampList,
      disseminationStatusList,
    } = this.props;
    if (!conceptSearchList) this.props.loadConceptSearchList();
    if (!stampList) this.props.loadStampList();
    if (!disseminationStatusList) this.props.loadDisseminationStatusList();
  }

  render() {
    const {
      conceptSearchList,
      stampList,
      disseminationStatusList,
    } = this.props;

    if (!(conceptSearchList && stampList && disseminationStatusList))
      return (
        <div>
          <Loadable
            active={true}
            spinner
            text={dictionary.loadable.loading}
            color="#457DBB"
            background="grey"
            spinnerSize="400px"
          />
        </div>
      );

    return (
      <ConceptSearchList
        conceptSearchList={conceptSearchList}
        stampList={stampList}
        disseminationStatusList={disseminationStatusList}
      />
    );
  }
}

const mapStateToProps = state => ({
  conceptSearchList: select.getConceptSearchList(state),
  stampList: select.getStampList(state),
  disseminationStatusList: select.getDisseminationStatusList(state),
});
const mapDispatchToProps = {
  loadConceptSearchList,
  loadStampList,
  loadDisseminationStatusList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ConceptSearchListContainer
);
