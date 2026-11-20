import { type MouseEvent, useCallback, useState } from "react";

import { cx } from "@utils/cx";

import type { PhysicalInstanceResponse } from "../../types/api";
import { Ddi4Plugin } from "./Ddi4Plugin";
import "./Ddi4LangsPlugin.css";

interface Ddi4LangsPluginProps {
  dataByLangs: Map<string, PhysicalInstanceResponse>;
}

export const Ddi4LangsPlugin = ({ dataByLangs }: Readonly<Ddi4LangsPluginProps>) => {
  const langs = Array.from(dataByLangs.keys());
  const [selectedLang, setSelectedLang] = useState(langs[0] ?? "");

  const handleSelectLang = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setSelectedLang(event.currentTarget.dataset.lang ?? "");
  }, []);

  if (langs.length === 0) {
    return <div className="ddi4-langs-plugin-empty">No data available.</div>;
  }

  return (
    <div className="ddi4-langs-plugin">
      <div className="ddi4-langs-plugin-tabs">
        {langs.map((lang) => (
          <button
            key={lang}
            data-lang={lang}
            onClick={handleSelectLang}
            className={cx(
              "ddi4-langs-plugin-tab",
              selectedLang === lang && "ddi4-langs-plugin-tab-selected",
            )}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="ddi4-langs-plugin-content">
        <Ddi4Plugin key={selectedLang} data={dataByLangs.get(selectedLang)} />
      </div>
    </div>
  );
};
