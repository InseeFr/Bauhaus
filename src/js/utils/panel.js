import React, { Component } from 'react';
import '../../css/panel.css';

class Panel extends Component {
  render() {
    return (
      <div className="panel panel-concepts">
        <div className="panel-heading">
          <h3 className="panel-title">{this.props.title}</h3>
        </div>
        <div className="panel-body">
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default Panel
