import React, { useState } from 'react';
import { Checkbox } from 'react-bootstrap';
import { Input } from 'bauhaus-library';
import { Pagination } from 'bauhaus-library';

import Badge from 'js/components/shared/badge';

import * as C from 'js/constants';
import D from 'js/i18n';
import { sortArray, filterDeburr } from 'js/utils/array-utils';

const sortArrayByLabel = sortArray('label');

const ComponentList = ({ components, checked, onCheck, onChange }) => {
	const [search, setSearch] = useState(() => '');

	const items = buildComponents(
		checked,
		sortArrayByLabel(components),
		onChange,
		search
	);

	return (
		<>
			<div className="row">
				<div className="col-md-4 centered">
					<Checkbox
						defaultChecked={checked[C.ATTRIBUTE_TYPE]}
						onChange={() => onCheck(C.ATTRIBUTE_TYPE)}
					>
						{D.attributsTitle}
					</Checkbox>
				</div>
				<div className="col-md-4 centered">
					<Checkbox
						defaultChecked={checked[C.DIMENSION_TYPE]}
						onChange={() => onCheck(C.DIMENSION_TYPE)}
					>
						{D.dimensionsTitle}
					</Checkbox>
				</div>
				<div className="col-md-4 centered">
					<Checkbox
						defaultChecked={checked[C.MEASURE_TYPE]}
						onChange={() => onCheck(C.MEASURE_TYPE)}
					>
						{D.measuresTitle}
					</Checkbox>
				</div>
			</div>
			<div className="row">
				<div className="col-md-10 col-md-offset-1 centered">
					<Input
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder={D.searchLabelPlaceholder}
					/>
					<Pagination itemEls={items} itemsPerPage="10" />
				</div>
			</div>
		</>
	);
};

export default ComponentList;

const buildComponents = (checked, components, onChange, search) =>
	components.reduce((_, component, i) => {
		const { id, label, type } = component;
		if (checked[type] && filterDeburr(search)(label)) {
			_.push(
				<div className="row" key={`${type}-${i}`}>
					<button
						onClick={() => onChange(id, type)}
						className="btn-no-btn list-group-item"
					>
						<span>{label}</span> <Badge type={type} />
					</button>
				</div>
			);
		}
		return _;
	}, []);
