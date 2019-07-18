import { Component } from 'react';

const handleFieldChange = (fields, handleChange) =>
	fields.reduce((handlers, field) => {
		handlers[field] = value => handleChange({ [field]: value });
		return handlers;
	}, {});

export class AbstractSearchComponent extends Component {
	constructor(props, emptyState) {
		super(props);
		this.emptyState = emptyState;
		this.state = {
			askForReturn: false,
			...this.getEmptyState(),
		};
	}
	getEmptyState = () => {
		return {
			data: this.props.data,
			...this.emptyState,
		};
	};
	initializeState = () => this.setState(this.getEmptyState());
	handleChange = (fields, filterData) =>
		handleFieldChange(fields, stateChange => {
			const newState = Object.assign(this.state, stateChange);
			const data = filterData(newState);
			this.setState(Object.assign(stateChange, { data }));
		});
}
