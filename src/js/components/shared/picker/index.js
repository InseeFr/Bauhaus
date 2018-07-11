import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import D from 'js/i18n';
import Panel from 'js/components/shared/panel';
import Pagination from 'js/components/shared/pagination';
import Item from 'js/components/shared/picker-item';
import { filterDeburr } from 'js/utils/array-utils';
import addLogo from 'js/components/shared/logo-add';
import delLogo from 'js/components/shared/logo-del';

class Picker extends Component {
	constructor(props) {
		super(props);

		this.trackItems = items => {
			return (
				items &&
				items.map(({ id, label }) => ({
					id,
					label,
					isAdded: false,
				}))
			);
		};

		this.state = {
			searchLabel: '',
			items: this.trackItems(this.props.items),
		};

		this.handleChange = searchLabel => {
			this.setState({ searchLabel });
		};

		this.addItem = id => {
			const itemsToAdd = this.state.items.map(item => {
				//mutation, but not harmful here
				if (item.id === id) item.isAdded = true;
				return item;
			});
			this.setState({
				itemsToAdd,
			});
		};

		this.removeItem = id => {
			const itemsToAdd = this.state.items.map(item => {
				//mutation, but not harmful here
				if (item.id === id) item.isAdded = false;
				return item;
			});
			this.setState({
				itemsToAdd,
			});
		};

		this.getItemsByStatus = () => {
			const { items } = this.state;
			const check = filterDeburr(this.state.searchLabel);
			return items.reduce(
				(byStatus, { id, label, isAdded }) => {
					if (isAdded) byStatus.added.push({ id, label });
					else check(label) && byStatus.toAdd.push({ id, label });
					return byStatus;
				},
				{ toAdd: [], added: [] }
			);
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.items !== this.props.items)
			this.setState({
				items: this.trackItems(nextProps.items),
			});
	}

	render() {
		const { searchLabel } = this.state;
		const { panelTitle, context } = this.props;

		//validation has not been asked yet
		const { toAdd, added } = this.getItemsByStatus();

		const toAddEls = toAdd.map(({ id, label }) => (
			<Item
				key={id}
				id={id}
				label={label}
				logo={addLogo}
				handleClick={this.addItem}
			/>
		));

		const addedEls = added.map(({ id, label }) => (
			<Item
				key={id}
				id={id}
				label={label}
				logo={delLogo}
				handleClick={this.removeItem}
			/>
		));

		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-6">
							<Panel title={panelTitle}>{addedEls}</Panel>
						</div>
						<div className="col-md-6 centered">
							<input
								value={searchLabel}
								onChange={e => this.handleChange(e.target.value)}
								type="text"
								placeholder={D.searchLabelPlaceholder}
								className="form-control"
							/>
							<Pagination
								itemEls={toAddEls}
								itemsPerPage="10"
								context={context}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Picker.propTypes = {
	panelTitle: PropTypes.string.isRequired,
	labelWarning: PropTypes.string.isRequired,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		})
	),
	context: PropTypes.oneOf([
		'',
		'concepts',
		'collections',
		'classifications',
		'operations',
	]).isRequired,
};

export default Picker;
