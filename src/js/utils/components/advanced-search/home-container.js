import { Component } from 'react';

const handleFieldChange = (fields, handleChange) =>
	fields.reduce((handlers, field) => {
		handlers[field] = value => handleChange({ [field]: value });
		return handlers;
	}, {});


export class AbstractAdvancedSearchComponent extends Component {
	constructor(props, emptyState) {
		super(props);
		this.emptyState = emptyState;
		this.state = {
			askForReturn: false,
			...this.getEmptyState(),
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.data) {
			this.setState({
				...nextProps.data,
			});
		}
	}

	getEmptyState = () => {
		return {
			...this.props,
			...this.emptyState,
		};
	};

	handleChange = (fields, filterData) =>
		handleFieldChange(fields, stateChange => {
			this.setState(stateChange);
			filterData(stateChange);
		});
}
