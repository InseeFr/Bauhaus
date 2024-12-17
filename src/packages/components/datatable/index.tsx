import { FilterMatchMode } from 'primereact/api';
import { DataTable as PrimeDataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { ComponentPropsWithoutRef, PropsWithChildren, useState } from 'react';

import { createAllDictionary } from '../../utils/dictionnary';

const { D } = createAllDictionary({
	placeholder: {
		fr: 'Rechercher dans le tableau...',
		en: 'Search in the table...',
	},
});

interface DataTableTypes {
	withPagination?: boolean;
	globalFilterFields?: boolean;
}
export const DataTable = ({
	children,
	withPagination = true,
	...props
}: Readonly<
	PropsWithChildren<
		DataTableTypes & ComponentPropsWithoutRef<typeof PrimeDataTable>
	>
>) => {
	const [globalFilterValue, setGlobalFilterValue] = useState('');
	const [filters, setFilters] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	});
	const onGlobalFilterChange = (e) => {
		const value = e.target.value;
		const _filters = { ...filters };

		_filters['global'].value = value;

		setFilters(_filters);
		setGlobalFilterValue(value);
	};

	let header = <></>;
	if (props.globalFilterFields) {
		header = (
			<div className="flex flex-wrap gap-2 justify-content-between align-items-center">
				<IconField iconPosition="left">
					<InputIcon className="pi pi-search" />
					<InputText
						value={globalFilterValue}
						onChange={onGlobalFilterChange}
						placeholder={D.placeholder}
					/>
				</IconField>
			</div>
		);
	}
	return (
		<PrimeDataTable
			header={header}
			filters={filters}
			paginator={withPagination}
			rows={5}
			rowsPerPageOptions={[5, 10, 25, 50]}
			stripedRows
			selectionMode="single"
			{...props}
		>
			{children}
		</PrimeDataTable>
	);
};
