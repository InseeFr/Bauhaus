import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import D from 'js/i18n';
import { PageTitle } from 'bauhaus-library';
import { Button } from 'bauhaus-library';
import Panel from 'js/components/shared/panel';
import { Pagination } from 'bauhaus-library';
import Item from 'js/components/shared/picker-item';
import { filterDeburr } from 'js/utils/array-utils';
import addLogo from 'js/components/shared/logo/logo-add';
import delLogo from 'js/components/shared/logo/logo-del';

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

		this.handleClickValid = e => {
			const added = this.state.items.filter(({ isAdded }) => isAdded);
			const addedIds = added.map(({ id }) => id);
			this.props.handleAction(addedIds);
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
		const {
			title,
			panelTitle,
			labelWarning,
			labelValidateButton,
			context,
		} = this.props;

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

		//The user has to add at least one item
		const message = added.length === 0 && (
			<div className="col-md-8 centered">
				<div className="alert alert-danger bold" role="alert">
					{labelWarning}
				</div>
			</div>
		);

		const controls = (
			<div className="row btn-line">
				<Button label={D.btnReturn} action={`/${context}`} />
				{message}
				<Button
					label={labelValidateButton}
					action={this.handleClickValid}
					disabled={added.length === 0}
					offset={message ? 0 : 8}
				/>
			</div>
		);

		return (
			<div>
				<div className="container">
					<PageTitle title={title} />
					{controls}
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
							<Pagination itemEls={toAddEls} itemsPerPage="10" />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Picker.propTypes = {
	title: PropTypes.string.isRequired,
	panelTitle: PropTypes.string.isRequired,
	labelWarning: PropTypes.string.isRequired,
	labelValidateButton: PropTypes.string.isRequired,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		})
	), //not required since this component can be created before the items are
	//loaded
	handleAction: PropTypes.func.isRequired,
	context: PropTypes.oneOf([
		'',
		'concepts',
		'collections',
		'classifications',
		'operations',
	]).isRequired,
};

export default Picker;
