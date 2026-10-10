/** Nombre maximal de lignes de données (hors en-tête) acceptées par un import CSV. */
export const MAX_CSV_IMPORT_ROWS = 5000;

export interface CsvCodeRow {
  code: string;
  value: string;
}

export type CsvImportError =
  | { line: number; kind: "emptyCode" | "emptyValue" | "invalidColumnCount" | "unclosedQuote" }
  | { line: number; kind: "duplicateCode"; code: string }
  | { kind: "noData" }
  | { kind: "tooManyRows"; max: number };

export interface CsvImportResult {
  rows: CsvCodeRow[];
  errors: CsvImportError[];
}

interface CsvRecord {
  /** Ligne physique (1-based) où commence l'enregistrement. */
  line: number;
  fields: string[];
  unclosedQuote: boolean;
}

/** Premier séparateur (`,` ou `;`) rencontré hors guillemets sur la ligne d'en-tête. */
const detectSeparator = (text: string): string => {
  let inQuotes = false;
  for (const char of text) {
    if (char === '"') inQuotes = !inQuotes;
    else if (!inQuotes && (char === "," || char === ";")) return char;
    else if (!inQuotes && char === "\n") break;
  }
  return ",";
};

const isBlank = (record: CsvRecord) =>
  record.fields.length === 1 && record.fields[0].trim() === "" && !record.unclosedQuote;

/** Découpe le texte en enregistrements selon les règles CSV usuelles (RFC 4180). */
const tokenize = (text: string, separator: string): CsvRecord[] => {
  const records: CsvRecord[] = [];
  let line = 1;
  let record: CsvRecord = { line, fields: [], unclosedQuote: false };
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        if (char === "\n") line++;
        field += char;
      }
    } else if (char === '"' && field.trim() === "") {
      field = "";
      inQuotes = true;
    } else if (char === separator) {
      record.fields.push(field);
      field = "";
    } else if (char === "\n") {
      record.fields.push(field);
      records.push(record);
      line++;
      record = { line, fields: [], unclosedQuote: false };
      field = "";
    } else {
      field += char;
    }
  }
  record.fields.push(field);
  record.unclosedQuote = inQuotes;
  records.push(record);

  return records.filter((r) => !isBlank(r));
};

/**
 * Lit un fichier CSV de deux colonnes (code, valeur de la catégorie). La première ligne est
 * toujours considérée comme un en-tête. Le fichier est validé en entier : l'appelant ne doit rien
 * créer dès qu'une erreur est remontée.
 */
export const parseCodeListCsv = (text: string): CsvImportResult => {
  const normalized = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const [, ...dataRecords] = tokenize(normalized, detectSeparator(normalized));

  if (dataRecords.length === 0) {
    return { rows: [], errors: [{ kind: "noData" }] };
  }
  if (dataRecords.length > MAX_CSV_IMPORT_ROWS) {
    return { rows: [], errors: [{ kind: "tooManyRows", max: MAX_CSV_IMPORT_ROWS }] };
  }

  const rows: CsvCodeRow[] = [];
  const errors: CsvImportError[] = [];
  const seenCodes = new Set<string>();

  for (const { line, fields, unclosedQuote } of dataRecords) {
    if (unclosedQuote) {
      errors.push({ line, kind: "unclosedQuote" });
      continue;
    }
    if (fields.length !== 2) {
      errors.push({ line, kind: "invalidColumnCount" });
      continue;
    }
    const [code, value] = fields.map((f) => f.trim());
    if (code === "") errors.push({ line, kind: "emptyCode" });
    if (value === "") errors.push({ line, kind: "emptyValue" });
    if (code !== "") {
      const key = code.toLowerCase();
      if (seenCodes.has(key)) errors.push({ line, kind: "duplicateCode", code });
      seenCodes.add(key);
    }
    rows.push({ code, value });
  }

  return { rows, errors };
};
