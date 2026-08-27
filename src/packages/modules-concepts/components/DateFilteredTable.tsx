import { useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { DataTable } from "@components/datatable";
import { DatePicker } from "@components/date-picker";
import { NumberResults } from "@components/number-results";
import { Panel } from "@components/panel";

import { filterFromDate } from "../utils/filterFromDate";

import "./DateFilteredTable.css";
import "../../i18n";

type Props<T extends object> = {
  data: T[];
  dateField: keyof T & string;
  typeByLang: string;
  globalFilterFields: string[];
  onRowClick: (item: T) => void;
  children: React.ReactNode;
};

export function DateFilteredTable<T extends object>({
  data,
  dateField,
  typeByLang,
  globalFilterFields,
  onRowClick,
  children,
}: Readonly<Props<T>>) {
  const { t } = useTranslation();
  const [dateFilter, setDateFilter] = useState<string | undefined>(undefined);
  const pickerId = useId();

  const filteredData = filterFromDate(data, dateField, dateFilter);

  return (
    <div>
      <div className="date-filtered-table__filter form-group">
        <label htmlFor={pickerId}>{t("dashboard.listPickerTitle", { type: typeByLang })}</label>
        <DatePicker
          inputId={pickerId}
          value={dateFilter}
          onChange={(value) => setDateFilter(value)}
        />
      </div>
      <p className="date-filtered-table__results">
        <NumberResults results={filteredData} />
      </p>
      <Panel>
        <DataTable
          value={filteredData}
          globalFilterFields={globalFilterFields}
          onRowClick={({ data: item }) => onRowClick(item as T)}
        >
          {children}
        </DataTable>
      </Panel>
    </div>
  );
}
