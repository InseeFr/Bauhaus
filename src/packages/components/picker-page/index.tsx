//@ts-nocheck
import { useState } from 'react';

import { ErrorBloc } from '@components/errors-bloc';
import { TextInput } from '@components/form/input';
import { Row } from '@components/layout';
import { PageTitle } from '@components/page-title';
import { Pagination } from '@components/pagination';

import { filterDeburr } from '@utils/array-utils';

import D from '../../deprecated-locales';
import { ActionToolbar } from '../action-toolbar';
import { ReturnButton } from '../buttons/buttons-with-icons';
import { AddLogo } from '../logo/logo-add';
import { DelLogo } from '../logo/logo-del';
import { Panel } from '../panel';
import { PickerItem } from '../picker-item';

interface Item {
	id: string;
	label: string;
}
const trackItems = (items: Item[]) => {
	return (
		items &&
		items.map(({ id, label }) => ({
			id,
			label,
			isAdded: false,
		}))
	);
};

interface PickerTypes {
	items: any;
	handleAction: any;
	title: string;
	panelTitle: string;
	labelWarning: string;
	context: any;
	ValidationButton: () => JSX.Element;
	disabled?: boolean;
	disabledWarningMessage?: string;
}

export const Picker = ({
	items: itemsProps,
	handleAction,
	title,
	panelTitle,
	labelWarning,
	context,
	ValidationButton,
	disabled,
	disabledWarningMessage,
}: PickerTypes) => {
	const [search, setSearch] = useState('');
	const [items, setItems] = useState(() => trackItems(itemsProps ?? []));
	const [clientSideErrors, setClientSideErrors] = useState('');

	const handleChange = (searchLabel: string) => setSearch(searchLabel);

	const handleUpdateIds = () => {
		const added = items.filter(({ isAdded }) => isAdded);
		const addedIds = added.map(({ id }) => id);
		handleAction(addedIds);
	};

	const addItem = (id: string) => {
		setClientSideErrors('');
		setItems(
			items.map((item) => {
				if (item.id === id) item.isAdded = true;
				return item;
			}),
		);
		handleUpdateIds();
	};

	const removeItem = (id: string) => {
		setClientSideErrors('');
		setItems(
			items.map((item) => {
				if (item.id === id) item.isAdded = false;
				return item;
			}),
		);
		handleUpdateIds();
	};

	const handleClickValid = () => {
		const message = added.length === 0 ? labelWarning : '';
		if (message) {
			setClientSideErrors(message);
		} else {
			handleUpdateIds();
		}
	};

	const getItemsByStatus = (): { toAdd: Item[]; added: Item[] } => {
		const check = filterDeburr(search);
		return items.reduce(
			(byStatus, { id, label, isAdded }) => {
				if (isAdded) byStatus.added.push({ id, label });
				else if (check(label)) {
					byStatus.toAdd.push({ id, label });
				}
				return byStatus;
			},
			{ toAdd: [], added: [] } as { toAdd: Item[]; added: Item[] },
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
				<ErrorBloc error={clientSideErrors} />
				{disabled && <ErrorBloc error={disabledWarningMessage} />}
				<Row>
					<div className="col-md-6">
						<Panel title={panelTitle}>{addedEls}</Panel>
					</div>
					<div className="col-md-6 text-center">
						<TextInput
							value={search}
							onChange={(e) => handleChange(e.target.value)}
							placeholder={D.searchLabelPlaceholder}
						/>
						<Pagination itemEls={toAddEls} />
					</div>
				</Row>
			</div>
		</div>
	);
};
