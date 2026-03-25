import { useState } from "react";
import { Ddi4Plugin } from "./Ddi4Plugin";
import type { PhysicalInstanceResponse } from "../../types/api";

interface Ddi4LangsPluginProps {
  dataByLangs: Map<string, PhysicalInstanceResponse>;
}

export const Ddi4LangsPlugin = ({ dataByLangs }: Readonly<Ddi4LangsPluginProps>) => {
  const langs = Array.from(dataByLangs.keys());
  const [selectedLang, setSelectedLang] = useState(langs[0] ?? "");

  if (langs.length === 0) {
    return <div style={{ padding: "20px" }}>No data available.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          gap: "4px",
          padding: "8px 16px",
          borderBottom: "1px solid #e0e0e0",
          background: "#f8f9fa",
        }}
      >
        {langs.map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLang(lang)}
            style={{
              padding: "4px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              background: selectedLang === lang ? "#0971f1" : "#fff",
              color: selectedLang === lang ? "#fff" : "#333",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: selectedLang === lang ? "bold" : "normal",
            }}
          >
            {lang}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        <Ddi4Plugin key={selectedLang} data={dataByLangs.get(selectedLang)} />
      </div>
    </div>
  );
};
