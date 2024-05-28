import React, { useState } from 'react';
import D from '../../i18n/build-dictionary';
import {
	Pagination,
	Panel,
	AddLogo,
	DelLogo,
	filterDeburr,
	PickerItem,
	ActionToolbar,
} from '@inseefr/wilco';
import '../codelist-detail/edit.scss';

const Picker = ({
	panelTitle,
	codes,
	addAll,
	removeAll,
	addAction,
	removeAction,
}) => {
	const [searchLabel, setSearchLabel] = useState('');

	const getCodesByStatus = () => {
		const check = filterDeburr(searchLabel);
		return codes.reduce(
			(byStatus, { id, label, isPartial }) => {
				if (isPartial) byStatus.selected.push({ id, label });
				else check(label) && byStatus.toSelect.push({ id, label });
				return byStatus;
			},
			{ toSelect: [], selected: [] }
		);
	};
	const { toSelect, selected } = getCodesByStatus();
	const toAddElements = toSelect.map(({ id, label }) => (
		<PickerItem
			key={id}
			id={id}
			label={label}
			logo={AddLogo}
			handleClick={addAction}
		/>
	));
	const addedElements = selected.map(({ id, label }) => (
		<PickerItem
			key={id}
			id={id}
			label={label}
			logo={DelLogo}
			handleClick={removeAction}
		/>
	));

	return (
		<div className="container">
			<ActionToolbar>
				<button
					type="button"
					key={`removeAll`}
					className="btn wilco-btn btn-lg col-md-4"
					onClick={removeAll}
				>
					{D.removeAll}
				</button>

				<button
					type="button"
					key={`addAll`}
					className="btn wilco-btn btn-lg col-md-4"
					onClick={addAll}
				>
					{D.addAll}
				</button>
			</ActionToolbar>
			<div className="row">
				<div className="col-md-6">
					<Panel title={panelTitle}>{addedElements}</Panel>
				</div>
				<div className="col-md-6 text-center">
					<input
						value={searchLabel}
						onChange={(e) => setSearchLabel(e.target.value)}
						type="text"
						placeholder={D.searchLabelPlaceholder}
						className="form-control"
					/>
					<Pagination itemEls={toAddElements} itemsPerPage="10" />
				</div>
			</div>
		</div>
	);
};

export default Picker;
