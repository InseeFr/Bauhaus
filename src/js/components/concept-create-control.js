import React, { Component } from 'react';
import _ from 'lodash';
import { maxLengthScopeNote } from '../../config/config';
import { editorLength } from './editor-html';
import { dictionary } from '../utils/dictionary';

class ConceptCreateControl extends Component {

  render() {
    const { attr, onChangeSave, onChangeReturn } = this.props

    if (attr.isLabelFrExisting) {
    return (
      <div className='row btn-line'>
        <div className='col-md-2'>
          <button type="button" className="btn btn-primary btn-lg col-md-12" onClick={onChangeReturn}>
            <span className="glyphicon glyphicon-floppy-remove" aria-hidden="true">
            </span> {dictionary.buttons.cancel}
          </button>
        </div>
        <div className='col-md-8 centered'>
          <div className="alert alert-danger bold" role="alert">
            {dictionary.warning.duplicated.label}
          </div>
        </div>
        <div className='col-md-2'>
          <button type="button" className="btn btn-primary btn-lg col-md-12" disabled>
            <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true">
            </span> {dictionary.buttons.save}
          </button>
        </div>
      </div>
    )}
    if (!attr.prefLabelFr || !attr.creator || !attr.disseminationStatus) {
      return (
        <div className='row btn-line'>
          <div className='col-md-2'>
            <button type="button" className="btn btn-primary btn-lg col-md-12" onClick={onChangeReturn}>
              <span className="glyphicon glyphicon-floppy-remove" aria-hidden="true">
              </span> {dictionary.buttons.cancel}
            </button>
          </div>
          <div className='col-md-8 centered'>
            <div className="alert alert-danger bold" role="alert">
              {dictionary.warning.missing.concept}
            </div>
          </div>
          <div className='col-md-2'>
            <button type="button" className="btn btn-primary btn-lg col-md-12" disabled>
              <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true">
              </span> {dictionary.buttons.save}
            </button>
          </div>
        </div>
      )
    }
    if (!attr.isDefinitionFr) {
      return (
        <div className='row btn-line'>
          <div className='col-md-2'>
            <button type="button" className="btn btn-primary btn-lg col-md-12" onClick={onChangeReturn}>
              <span className="glyphicon glyphicon-floppy-remove" aria-hidden="true">
              </span> {dictionary.buttons.cancel}
            </button>
          </div>
          <div className='col-md-8 centered'>
            <div className="alert alert-danger bold" role="alert">
              {dictionary.warning.notes.definitionFr}
            </div>
          </div>
          <div className='col-md-2'>
            <button type="button" className="btn btn-primary btn-lg col-md-12" disabled>
              <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true">
              </span> {dictionary.buttons.save}
            </button>
          </div>
        </div>
      )
    }
    if (_.includes(attr.disseminationStatus, "Public") && !attr.isDefinitionCourteFr) {
      return (
        <div className='row btn-line'>
          <div className='col-md-2'>
            <button type="button" className="btn btn-primary btn-lg col-md-12" onClick={onChangeReturn}>
              <span className="glyphicon glyphicon-floppy-remove" aria-hidden="true">
              </span> {dictionary.buttons.cancel}
            </button>
          </div>
          <div className='col-md-8 centered'>
            <div className="alert alert-danger bold" role="alert">
              {dictionary.warning.notes.scopeNoteFr}
            </div>
          </div>
          <div className='col-md-2'>
            <button type="button" className="btn btn-primary btn-lg col-md-12" disabled>
              <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true">
              </span> {dictionary.buttons.save}
            </button>
          </div>
        </div>
      )
    }
    if (!attr.isDefinitionCourteFr && attr.isDefinitionCourteEn) {
      return (
        <div className='row btn-line'>
          <div className='col-md-2'>
            <button type="button" className="btn btn-primary btn-lg col-md-12" onClick={onChangeReturn}>
              <span className="glyphicon glyphicon-floppy-remove" aria-hidden="true">
              </span> {dictionary.buttons.cancel}
            </button>
          </div>
          <div className='col-md-8 centered'>
            <div className="alert alert-danger bold" role="alert">
              {dictionary.warning.notes.scopeNote}
            </div>
          </div>
          <div className='col-md-2'>
            <button type="button" className="btn btn-primary btn-lg col-md-12" disabled>
              <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true">
              </span> {dictionary.buttons.save}
            </button>
          </div>
        </div>
      )
    }

    if (editorLength(attr.definitionCourteFr) > maxLengthScopeNote || editorLength(attr.definitionCourteEn) > maxLengthScopeNote) {
      return (
        <div className='row btn-line'>
          <div className='col-md-2'>
            <button type="button" className="btn btn-primary btn-lg col-md-12" onClick={onChangeReturn}>
              <span className="glyphicon glyphicon-floppy-remove" aria-hidden="true">
              </span> {dictionary.buttons.cancel}
            </button>
          </div>
          <div className='col-md-8 centered'>
            <div className="alert alert-danger bold" role="alert">
              {dictionary.warning.notes.maxLengthScopeNote(maxLengthScopeNote)}
            </div>
          </div>
          <div className='col-md-2'>
            <button type="button" className="btn btn-primary btn-lg col-md-12" disabled>
              <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true">
              </span> {dictionary.buttons.save}
            </button>
          </div>
        </div>
      )
    }

    if (!attr.isNoteEditorialeFr && attr.isNoteEditorialeEn) {
      return (
        <div className='row btn-line'>
          <div className='col-md-2'>
            <button type="button" className="btn btn-primary btn-lg col-md-12" onClick={onChangeReturn}>
              <span className="glyphicon glyphicon-floppy-remove" aria-hidden="true">
              </span> {dictionary.buttons.cancel}
            </button>
          </div>
          <div className='col-md-8 centered'>
            <div className="alert alert-danger bold" role="alert">
              {dictionary.warning.notes.editorialeNote}
            </div>
          </div>
          <div className='col-md-2'>
            <button type="button" className="btn btn-primary btn-lg col-md-12" disabled>
              <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true">
              </span> {dictionary.buttons.save}
            </button>
          </div>
        </div>
      )
    }

    if (!attr.isChangeNoteFr && attr.isChangeNoteEn) {
    return (
      <div className='row btn-line'>
        <div className='col-md-2'>
          <button type="button" className="btn btn-primary btn-lg col-md-12" onClick={onChangeReturn}>
            <span className="glyphicon glyphicon-floppy-remove" aria-hidden="true">
            </span> {dictionary.buttons.cancel}
          </button>
        </div>
        <div className='col-md-8 centered'>
          <div className="alert alert-danger bold" role="alert">
            {dictionary.warning.notes.changeNote}
          </div>
        </div>
        <div className='col-md-2'>
          <button type="button" className="btn btn-primary btn-lg col-md-12" disabled>
            <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true">
            </span> {dictionary.buttons.save}
          </button>
        </div>
      </div>
    )}

    if (attr.prefLabelFr && attr.creator && attr.disseminationStatus && !attr.isLabelFrExisting && attr.isDefinitionFr) {
      return (
        <div className='row btn-line'>
          <div className='col-md-2'>
            <button type="button" className="btn btn-primary btn-lg col-md-12" onClick={onChangeReturn}>
              <span className="glyphicon glyphicon-floppy-remove" aria-hidden="true">
              </span> {dictionary.buttons.cancel}
            </button>
          </div>
          <div className='col-md-2 pull-right'>
            <button type="button" className="btn btn-primary btn-lg col-md-12" onClick={onChangeSave}>
              <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true">
              </span> {dictionary.buttons.save}
            </button>
          </div>
        </div>
      )
    }
  }
}
export default ConceptCreateControl
