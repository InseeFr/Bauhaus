import dayjs from "dayjs";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { DataTable } from "@components/datatable";
import { DatePicker } from "@components/date-picker";
import { Row } from "@components/layout";
import { NumberResults } from "@components/number-results";
import { Panel } from "@components/panel";

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

  const filteredData = !dateFilter
    ? data
    : data.filter((item) =>
        dayjs((item as Record<string, string>)[dateField]).isAfter(
          dayjs(dateFilter).subtract(1, "days"),
        ),
      );

  return (
    <div>
      <Row style={{ marginTop: "2%" }}>
        <div className="form-group col-md-4 col-md-offset-4 text-center">
          <label htmlFor={pickerId}>{t("dashboard.listPickerTitle", { type: typeByLang })}</label>
          <DatePicker
            inputId={pickerId}
            value={dateFilter}
            onChange={(value) => setDateFilter(value)}
          />
        </div>
      </Row>
      <p className="row text-center">
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
