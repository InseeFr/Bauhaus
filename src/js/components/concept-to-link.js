import React, { Component } from 'react';
import { dictionary } from '../utils/dictionary';
import Panel from '../utils/panel';
import Pagination from './utils/pagination';


class ConceptToLink extends Component {

  render() {
    const {panelTitle, memberList, potentialMembersList, searchLabel, onChange} = this.props
    return (
      <div className='row'>
        <div className='col-md-6'>
          <Panel title={panelTitle}>
            {memberList}
          </Panel>
        </div>
        <div className='col-md-6 centered'>
          <input value={searchLabel} onChange={onChange} type='text' placeholder={dictionary.concept.searchLabel} className='form-control'/>
          <Pagination items={potentialMembersList} itemsPerPage='10'/>
        </div>
      </div>
    )
  }
}

export default ConceptToLink
