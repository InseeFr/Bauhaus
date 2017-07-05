import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import MenuConcepts from './menu-concepts';
import Loadable from 'react-loading-overlay';
import CollectionGeneral from './collection-general';
import { dictionary } from '../utils/dictionary';
import { Note } from '../utils/note';
import { sortArray } from '../utils/array-utils';
import { loadCollectionGeneral, loadCollectionMembers } from '../actions/collection';
import { postCollectionsToValidate } from '../utils/remote-api';

const sortByLabelFr = sortArray('prefLabelFr');
const sortByLabelEn = sortArray('prefLabelEn');

class CollectionByID extends Component {

  constructor(props) {
    super(props);
    this.state = {
      english: false,
      collectionsToValid: [{id: this.props.params.id}],
      validation: 'WAITING'
    }

    this.toggleEnglish = () => this.setState({
      english: !this.state.english
    })

    this.handleClickSend = e => {
      e.preventDefault();
      hashHistory.push('/collection/' + this.props.params.id + '/send');
    }

    this.handleClickModif = e => {
      e.preventDefault();
      hashHistory.push('/collection/' + this.props.params.id + '/modify');
    }

    this.handleClickValid = e => {
      e.preventDefault();
      const data = {
        collectionsToValid: this.state.collectionsToValid
      }
      this.setState({
        validation: 'PENDING'
      })
      postCollectionsToValidate(data)
        .then(() => {
          this.props.loadCollectionGeneral(this.props.params.id)
        })
        .then(() => {
          this.setState({
            validation: 'DONE'
          })
          hashHistory.push('/collection/' + this.props.params.id);
        })
    }
  }

  componentWillMount() {
    this.props.loadCollectionGeneral(this.props.params.id)
    this.props.loadCollectionMembers(this.props.params.id)
  }

  render() {
    const { collectionGeneral, collectionMembers } = this.props
    const { english, validation } = this.state

    if(!collectionGeneral || !collectionMembers) return null

    const memberListFr = sortByLabelFr(collectionMembers)
      .map((item) =>
      <li key={item.id}><Link to={'/concept/'+item.id}>{item.prefLabelFr}</Link></li>
    )
    const memberListEn = sortByLabelEn(collectionMembers)
      .map((item) =>
      <li key={item.id}><Link to={'/concept/'+item.id}>{item.prefLabelEn}</Link></li>
    )

    if (validation === 'PENDING') {
      return (
        <div>
          <MenuConcepts />
          <Loadable active={true} spinner text={dictionary.loadable.validation} color='#457DBB' background='grey' spinnerSize='400px' />
        </div>
      )
    }

    return (
      <div>
        <MenuConcepts />
          <div className="container">
            <div className='row'>
              <div className='col-md-12'>
                <label className="pull-right">
                  <input type="checkbox" checked={english} onChange={this.toggleEnglish}/> {dictionary.displayLg2}
                </label>
              </div>
            </div>
            {collectionGeneral.isValidated === dictionary.status.collection.valid &&
            <div className='row'>
              <div className='col-md-8'>
                <h2>{collectionGeneral.prefLabelFr}</h2>
              </div>
              <div className='col-md-2'>
                <button className="btn btn-primary btn-lg col-md-12" onClick={this.handleClickSend}>
                  {dictionary.buttons.send}
                </button>
              </div>
              <div className='col-md-2'>
                <button className="btn btn-primary btn-lg col-md-12" onClick={this.handleClickModif}>
                  {dictionary.buttons.modify}
                </button>
              </div>
            </div>}
            {collectionGeneral.isValidated === dictionary.status.collection.provisional &&
            <div className='row'>
              <div className='col-md-6'>
                <h2>{collectionGeneral.prefLabelFr}</h2>
              </div>
              <div className='col-md-2'>
                <button className="btn btn-primary btn-lg col-md-12" onClick={this.handleClickSend}>
                  {dictionary.buttons.send}
                </button>
              </div>
              <div className='col-md-2'>
                <button className="btn btn-primary btn-lg col-md-12" onClick={this.handleClickModif}>
                  {dictionary.buttons.modify}
                </button>
              </div>
              <div className='col-md-2'>
                <button className="btn btn-primary btn-lg col-md-12" onClick={this.handleClickValid}>
                  {dictionary.buttons.validate}
                </button>
              </div>
            </div>}
            <h2>{ english && <em>{collectionGeneral.prefLabelEn} </em> }</h2>
            <CollectionGeneral attr={collectionGeneral}/>
            {collectionGeneral.descriptionFr && <div className='row'>
              <Note text={collectionGeneral.descriptionFr} title={dictionary.collection.description} lang='fr' alone={!english} />
                { english && <Note text={collectionGeneral.descriptionEn} title={dictionary.collection.description} lang='en' alone={false} /> }
            </div>}
            <div className='row'>
                <Note text={memberListFr} title={dictionary.collection.members} lang='fr' alone={!english} />
                { english && <Note text={memberListEn} title={dictionary.collection.members} lang='en' alone={false} /> }
            </div>
          </div>
      </div>
  )}
}

const mapStateToProps = (state, ownProps) => ({
  collectionGeneral: state.collectionGeneral[ownProps.params.id],
  collectionMembers: state.collectionMembers[ownProps.params.id]
})

const mapDispatchToProps = {
  loadCollectionGeneral,
  loadCollectionMembers
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionByID)
