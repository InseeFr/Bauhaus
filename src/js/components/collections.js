import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import CollectionsList from './collections-list';
import { dictionary } from 'js/utils/dictionary';
import 'css/app.css';

class Collections extends Component {
  constructor() {
    super();

    this.handleClickNew = e => {
      e.preventDefault();
      this.props.history.push('/create/collection');
    };
    this.handleClickExport = e => {
      e.preventDefault();
      this.props.history.push('/collections/export');
    };
    this.handleClickValid = e => {
      e.preventDefault();
      this.props.history.push('/collections/validation');
    };
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-3 btn-group-vertical">
              <div className="row">
                <button
                  className="btn btn-primary btn-lg col-md-offset-3 col-md-6"
                  onClick={this.handleClickNew}>
                  <span
                    className="glyphicon glyphicon-plus"
                    aria-hidden="true"
                  />{' '}
                  {dictionary.buttons.new.collection}
                </button>
              </div>
              <div className="row">
                <button
                  className="btn btn-primary btn-lg col-md-offset-3 col-md-6"
                  disabled>
                  <span
                    className="glyphicon glyphicon-import"
                    aria-hidden="true"
                  />{' '}
                  {dictionary.buttons.import}
                </button>
              </div>
              <div className="row">
                <button
                  className="btn btn-primary btn-lg col-md-offset-3 col-md-6"
                  onClick={this.handleClickExport}>
                  <span
                    className="glyphicon glyphicon-export"
                    aria-hidden="true"
                  />{' '}
                  {dictionary.buttons.export}
                </button>
              </div>
              <div className="row">
                <button
                  className="btn btn-primary btn-lg col-md-offset-3 col-md-6"
                  onClick={this.handleClickValid}>
                  <span
                    className="glyphicon glyphicon-ok"
                    aria-hidden="true"
                  />{' '}
                  {dictionary.buttons.validate}
                </button>
              </div>
            </div>
            <div className="col-md-8 centered pull-right">
              <h2 className="page-title">
                {dictionary.collections.title}
              </h2>
              <CollectionsList />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Collections);
