import { useState, useMemo } from "react";

interface Ddi4PluginProps {
  data: unknown;
}

export const Ddi4Plugin = ({ data }: Readonly<Ddi4PluginProps>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const jsonString = useMemo(() => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return "Unable to stringify data";
    }
  }, [data]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
  };

  const filteredJson = useMemo(() => {
    if (!searchTerm) return jsonString;

    const lines = jsonString.split("\n");
    return lines.filter((line) => line.toLowerCase().includes(searchTerm.toLowerCase())).join("\n");
  }, [jsonString, searchTerm]);

  const togglePath = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderValue = (value: unknown, path: string = "", depth: number = 0): JSX.Element => {
    if (value === null) {
      return <span style={{ color: "#999", fontStyle: "italic" }}>null</span>;
    }

    if (value === undefined) {
      return <span style={{ color: "#999", fontStyle: "italic" }}>undefined</span>;
    }

    if (typeof value === "string") {
      return <span style={{ color: "#0b7285" }}>"{value}"</span>;
    }

    if (typeof value === "number") {
      return <span style={{ color: "#0971f1" }}>{value}</span>;
    }

    if (typeof value === "boolean") {
      return <span style={{ color: "#d9480f" }}>{String(value)}</span>;
    }

    if (Array.isArray(value)) {
      const isExpanded = expandedPaths.has(path);
      const hasItems = value.length > 0;

      return (
        <div style={{ display: "inline-block", verticalAlign: "top" }}>
          <span
            onClick={() => hasItems && togglePath(path)}
            style={{
              cursor: hasItems ? "pointer" : "default",
              userSelect: "none",
              fontWeight: "bold",
            }}
          >
            {hasItems && (isExpanded ? "▼" : "▶")} [{value.length}]
          </span>
          {isExpanded && hasItems && (
            <div style={{ paddingLeft: "20px", borderLeft: "1px solid #ddd" }}>
              {value.map((item, index) => (
                <div key={index} style={{ margin: "2px 0" }}>
                  <span style={{ color: "#881391", fontWeight: "600" }}>{index}:</span>{" "}
                  {renderValue(item, `${path}[${index}]`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === "object") {
      const entries = Object.entries(value);
      const isExpanded = expandedPaths.has(path);
      const hasEntries = entries.length > 0;

      return (
        <div style={{ display: "inline-block", verticalAlign: "top" }}>
          <span
            onClick={() => hasEntries && togglePath(path)}
            style={{
              cursor: hasEntries ? "pointer" : "default",
              userSelect: "none",
              fontWeight: "bold",
            }}
          >
            {hasEntries && (isExpanded ? "▼" : "▶")} {"{"}
            {entries.length}
            {"}"}
          </span>
          {isExpanded && hasEntries && (
            <div style={{ paddingLeft: "20px", borderLeft: "1px solid #ddd" }}>
              {entries.map(([key, val]) => (
                <div key={key} style={{ margin: "2px 0" }}>
                  <span style={{ color: "#881391", fontWeight: "600" }}>{key}:</span>{" "}
                  {renderValue(val, `${path}.${key}`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <span>{String(value)}</span>;
  };

  return (
    <div style={{ padding: "20px", height: "100%", overflow: "auto" }}>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search in JSON..."
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        />
        <button
          onClick={handleCopy}
          style={{
            padding: "8px 16px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            background: "#fff",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          📋 Copy JSON
        </button>
        <button
          onClick={() => {
            if (expandedPaths.size > 0) {
              setExpandedPaths(new Set());
            } else {
              const firstLevel = new Set<string>();
              if (data && typeof data === "object") {
                Object.keys(data).forEach((key) => {
                  firstLevel.add(key);
                });
              }
              setExpandedPaths(firstLevel);
            }
          }}
          style={{
            padding: "8px 16px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            background: "#fff",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {expandedPaths.size > 0 ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {searchTerm ? (
        <pre
          style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "4px",
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: "12px",
            lineHeight: "1.6",
          }}
        >
          {filteredJson}
        </pre>
      ) : (
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "14px",
            lineHeight: "1.6",
            background: "#fafafa",
            padding: "15px",
            borderRadius: "4px",
            border: "1px solid #e0e0e0",
          }}
        >
          {renderValue(data, "root")}
        </div>
      )}
    </div>
  );
};
