import React, { Component } from 'react'
import Select from 'react-select'
import { dictionary } from '../utils/dictionary';
import 'react-select/dist/react-select.css';

class SelectRmes extends Component {

  render() {

    const opts = this.props.options.map((opt) => {
      if (this.props.field) return { value: opt[this.props.field], label: opt[this.props.field] }
      else return { value: opt, label: opt }
    })

    return (
      <Select
        value={this.props.value}
        placeholder={this.props.placeholder}
        options={opts}
        onChange={this.props.onChange}
        clearable={true}
        searchable={this.props.searchable}
        noResultsText={dictionary.noResult}
      />)
  }
}

SelectRmes.defaultProps = {
  multi: false,
  clearable: false,
  searchable: true
}

SelectRmes.propTypes = {
  options: React.PropTypes.any,
  onChange: React.PropTypes.func,
  clearable: React.PropTypes.bool,
  searchable: React.PropTypes.bool,
  creatable: React.PropTypes.bool,
}

export default SelectRmes
