import { Column } from 'primereact/column';
import { DataTableStateEvent } from 'primereact/datatable';

import { DataTable } from '@components/datatable';

import { Code } from '@model/CodesList';

import { D1, D2 } from '../../../i18n/build-dictionary';

export interface TableTypes {
	loading: boolean;
	codesWithActions: Omit<Code, 'broader' | 'narrower' | 'closeMatch'> &
		{
			broader: string;
			narrower: string;
			closeMatch: string;
			actions: JSX.Element;
		}[];
	total: number;
	state: {
		first: number;
		rows: number;
	};
	onPage: (event: DataTableStateEvent) => void;
}

export const Table = ({
	codesWithActions,
	loading,
	state,
	total,
	onPage,
}: Readonly<TableTypes>) => {
	return (
		<DataTable
			loading={loading}
			lazy
			first={state.first}
			rows={state.rows}
			withPagination={total > 10}
			rowsPerPageOptions={[10]}
			totalRecords={total}
			value={codesWithActions}
			onPage={onPage}
		>
			<Column field="code" header={D1.codeTitle}></Column>

			<Column field="labelLg1" header={D1.codeLabel}></Column>

			<Column field="labelLg2" header={D2.codeLabel}></Column>

			<Column field="broader" header={D1.codelistBroader}></Column>

			<Column field="narrower" header={D1.codelistNarrower}></Column>

			<Column field="closeMatch" header={D1.codelistCloseMatch}></Column>

			<Column field="actions" header=""></Column>
		</DataTable>
	);
};
