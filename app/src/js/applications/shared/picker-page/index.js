import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import D from 'js/i18n';
import {
	PageTitle,
	ExportButton,
	Pagination,
	Panel,
	ErrorBloc,
	AddLogo,
	DelLogo,
	PickerItem,
	ActionToolbar,
	filterDeburr,
	ReturnButton,
} from '@inseefr/wilco';

const trackItems = items => {
	return (
		items &&
		items.map(({ id, label }) => ({
			id,
			label,
			isAdded: false,
		}))
	);
};

const Picker = ({
			items: itemsProps,
			handleAction,
			title,
			panelTitle,
			labelWarning,
			context,
			ValidationButton
}) => {
	const [search, setSearch] = useState('');
	const [items, setItems] = useState(trackItems(itemsProps ?? []));

	const handleChange = searchLabel => setSearch(searchLabel);
	const addItem = id => {
		setItems(items.map(item => {
			if (item.id === id) item.isAdded = true;
			return item;
		}))
	}

	const removeItem = id => {
		setItems(items.map(item => {
			if (item.id === id) item.isAdded = false;
			return item;
		}))
	}

	const handleClickValid = e => {
		const added = items.filter(({ isAdded }) => isAdded);
		const addedIds = added.map(({ id }) => id);
		handleAction(addedIds);
	};

	const getItemsByStatus = () => {
		const check = filterDeburr(search);
		return items.reduce(
			(byStatus, { id, label, isAdded }) => {
				if (isAdded) byStatus.added.push({ id, label });
				else check(label) && byStatus.toAdd.push({ id, label });
				return byStatus;
			},
			{ toAdd: [], added: [] }
		);
	};

	const { toAdd, added } = getItemsByStatus();

	const toAddEls = toAdd.map(({ id, label }) => (
		<PickerItem
			key={id}
			id={id}
			label={label}
			logo={AddLogo}
			handleClick={addItem}
		/>
	));

	const addedEls = added.map(({ id, label }) => (
		<PickerItem
			key={id}
			id={id}
			label={label}
			logo={DelLogo}
			handleClick={removeItem}
		/>
	));

	//The user has to add at least one item
	const message = added.length === 0 ? labelWarning : '';

	const controls = (
		<ActionToolbar>
			<ReturnButton action={`/${context}`} />
			<ValidationButton
				action={handleClickValid}
				disabled={added.length === 0}
			/>
		</ActionToolbar>
	);

	return (
		<div>
			<div className="container">
				<PageTitle title={title} />
				{controls}
				<ErrorBloc error={message} />

				<div className="row">
					<div className="col-md-6">
						<Panel title={panelTitle}>{addedEls}</Panel>
					</div>
					<div className="col-md-6 text-center">
						<input
							value={search}
							onChange={e => handleChange(e.target.value)}
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

Picker.propTypes = {
	title: PropTypes.string.isRequired,
	panelTitle: PropTypes.string.isRequired,
	labelWarning: PropTypes.string.isRequired,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		})
	), //not required since this component can be created before the items are
	ValidationButton: PropTypes.func,
	handleAction: PropTypes.func.isRequired,
	context: PropTypes.oneOf([
		'',
		'concepts',
		'collections',
		'classifications',
		'operations',
	]).isRequired,
};
Picker.defaultProps = {
	ValidationButton: ExportButton,
};

export default Picker;
