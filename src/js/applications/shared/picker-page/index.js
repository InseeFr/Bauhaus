import { useState } from 'react';
import D from 'js/i18n';
import { ErrorBloc } from 'js/utils';
import {
	PageTitle,
	ExportButton,
	Pagination,
	Panel,
	AddLogo,
	DelLogo,
	PickerItem,
	ActionToolbar,
	filterDeburr,
	ReturnButton,
} from '@inseefr/wilco';

const trackItems = (items) => {
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
	ValidationButton,
	disabled,
	disabledWarningMessage,
}) => {
	const [search, setSearch] = useState('');
	const [items, setItems] = useState(trackItems(itemsProps ?? []));
	const [clientSideErrors, setClientSideErrors] = useState('');

	const handleChange = (searchLabel) => setSearch(searchLabel);

	const handleUpdateIds = () => {
		const added = items.filter(({ isAdded }) => isAdded);
		const addedIds = added.map(({ id }) => id);
		handleAction(addedIds);
	};

	const addItem = (id) => {
		setClientSideErrors('');
		setItems(
			items.map((item) => {
				if (item.id === id) item.isAdded = true;
				return item;
			})
		);
		handleUpdateIds();
	};

	const removeItem = (id) => {
		setClientSideErrors('');
		setItems(
			items.map((item) => {
				if (item.id === id) item.isAdded = false;
				return item;
			})
		);
		handleUpdateIds();
	};

	const handleClickValid = () => {
		const message = added.length === 0 ? labelWarning : '';
		if (!!message) {
			setClientSideErrors(message);
		} else {
			handleUpdateIds();
		}
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

	const controls = (
		<ActionToolbar>
			<ReturnButton action={`/${context}`} />
			<ValidationButton
				action={handleClickValid}
				disabled={!!clientSideErrors}
			/>
		</ActionToolbar>
	);

	return (
		<div>
			<div className="container">
				<PageTitle title={title} />
				{controls}
				{clientSideErrors && <ErrorBloc error={clientSideErrors} />}
				{disabled && <ErrorBloc error={disabledWarningMessage} />}
				<div className="row">
					<div className="col-md-6">
						<Panel title={panelTitle}>{addedEls}</Panel>
					</div>
					<div className="col-md-6 text-center">
						<input
							type="text"
							value={search}
							onChange={(e) => handleChange(e.target.value)}
							placeholder={D.searchLabelPlaceholder}
							className="form-control"
						/>
						<Pagination itemEls={toAddEls} itemsPerPage="10" />
					</div>
				</div>
			</div>
		</div>
	);
};

Picker.defaultProps = {
	ValidationButton: ExportButton,
};

export default Picker;
