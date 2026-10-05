import { useId, useRef, useState, type DragEvent } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@components/ui/button";
import { Message } from "@components/ui/message";

import {
  MAX_CSV_IMPORT_ROWS,
  parseCodeListCsv,
  type CsvCodeRow,
  type CsvImportError,
} from "./codeListCsv";

type ImportError = CsvImportError | { kind: "notCsv" };

interface CodeListCsvImportProps {
  /** Appelé uniquement quand le fichier entier est valide ; `fileName` est sans extension. */
  onImport: (rows: CsvCodeRow[], fileName: string) => void;
}

/**
 * Sélection (bouton ou glisser-déposer) d'un fichier CSV de codes. Le fichier est validé en
 * entier avant tout import : à la moindre erreur, rien n'est importé et toutes les erreurs sont
 * listées avec leur numéro de ligne.
 */
export const CodeListCsvImport = ({ onImport }: Readonly<CodeListCsvImportProps>) => {
  const { t } = useTranslation();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const importFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setErrors([{ kind: "notCsv" }]);
      return;
    }
    const { rows, errors: csvErrors } = parseCodeListCsv(await file.text());
    setErrors(csvErrors);
    if (csvErrors.length === 0) {
      onImport(rows, file.name.replace(/\.csv$/i, ""));
    }
  };

  const describeError = (error: ImportError) => {
    switch (error.kind) {
      case "duplicateCode":
        return t("physicalInstance.view.code.csvImport.errors.duplicateCode", {
          code: error.code,
        });
      case "tooManyRows":
        return t("physicalInstance.view.code.csvImport.errors.tooManyRows", { max: error.max });
      default:
        return t(`physicalInstance.view.code.csvImport.errors.${error.kind}`);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) importFile(file);
  };

  const lineErrors = errors.filter((error) => "line" in error);
  const fileErrors = errors.filter((error) => !("line" in error));

  return (
    <div className="code-list-csv-import">
      <div
        data-testid="csv-dropzone"
        className={`code-list-csv-dropzone${dragOver ? " code-list-csv-dropzone-active" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <i className="pi pi-file-import" aria-hidden />
        <span>{t("physicalInstance.view.code.csvImport.dropzone")}</span>
        <Button
          type="button"
          icon="pi pi-folder-open"
          label={t("physicalInstance.view.code.csvImport.chooseFile")}
          outlined
          size="small"
          onClick={() => inputRef.current?.click()}
        />
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept=".csv,text/csv"
          className="code-list-csv-input"
          aria-label={t("physicalInstance.view.code.csvImport.fileInput")}
          onChange={(event) => {
            const file = event.target.files?.[0];
            // Vidé pour qu'une nouvelle sélection du même fichier, une fois corrigé, soit relue.
            event.target.value = "";
            if (file) importFile(file);
          }}
        />
      </div>
      <p className="code-list-csv-help">
        {t("physicalInstance.view.code.csvImport.help", { max: MAX_CSV_IMPORT_ROWS })}
      </p>
      {fileErrors.map((error) => (
        <Message key={error.kind} severity="error" text={describeError(error)} />
      ))}
      {lineErrors.length > 0 && (
        <>
          <Message
            severity="error"
            text={t("physicalInstance.view.code.csvImport.rejected", {
              count: lineErrors.length,
            })}
          />
          <table className="code-list-csv-errors">
            <caption>{t("physicalInstance.view.code.csvImport.errorsCaption")}</caption>
            <thead>
              <tr>
                <th scope="col">{t("physicalInstance.view.code.csvImport.line")}</th>
                <th scope="col">{t("physicalInstance.view.code.csvImport.error")}</th>
              </tr>
            </thead>
            <tbody>
              {lineErrors.map((error, index) => (
                <tr key={index}>
                  <td>{error.line}</td>
                  <td>{describeError(error)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
