import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { dictionary } from '../utils/dictionary';
import 'react-select/dist/react-select.css';
import './select-rmes.css';

class SelectRmes extends Component {
	render() {
		const opts = this.props.options.map(opt => {
			if (this.props.field)
				return { value: opt[this.props.field], label: opt[this.props.field] };
			else return { value: opt, label: opt };
		});

		return (
			<Select
				value={this.props.value}
				placeholder={this.props.placeholder}
				options={opts}
				onChange={this.props.onChange}
				clearable={true}
				searchable={this.props.searchable}
				noResultsText={dictionary.noResult}
			/>
		);
	}
}

SelectRmes.defaultProps = {
	multi: false,
	clearable: false,
	searchable: true,
};

SelectRmes.propTypes = {
	options: PropTypes.any,
	onChange: PropTypes.func,
	clearable: PropTypes.bool,
	searchable: PropTypes.bool,
	creatable: PropTypes.bool,
};

export default SelectRmes;
