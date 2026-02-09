import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
import type {
  NumericRepresentation,
  DateTimeRepresentation,
  TextRepresentation,
  CodeRepresentation,
  CodeList,
  Category,
} from "../../types/api";
import { DDIApi } from "../../../../sdk";
import { useAppContext } from "../../../../application/app-context";
import { DdiXmlPreview } from "./DdiXmlPreview";
import { DdiJsonPreview } from "./DdiJsonPreview";
import { ddiPreviewReducer, initialState, type DdiFormat } from "./DdiPreview.reducer";

interface DdiPreviewProps {
  variableId: string;
  variableName: string;
  variableLabel: string;
  variableDescription?: string;
  variableType: string;
  isGeographic: boolean;
  numericRepresentation?: NumericRepresentation;
  dateRepresentation?: DateTimeRepresentation;
  textRepresentation?: TextRepresentation;
  codeRepresentation?: CodeRepresentation;
  codeList?: CodeList;
  categories?: Category[];
}

const FORMAT_LABELS: Record<DdiFormat, string> = {
  DDI3: "DDI 3.3",
  DDI4: "DDI 4.0/JSON",
};

export const DdiPreview = ({
  variableId,
  variableName,
  variableLabel,
  variableDescription,
  variableType,
  isGeographic,
  numericRepresentation,
  dateRepresentation,
  textRepresentation,
  codeRepresentation,
  codeList,
  categories,
}: Readonly<DdiPreviewProps>) => {
  const { t } = useTranslation();
  const { properties } = useAppContext();
  const defaultAgencyId = properties.defaultAgencyId;
  const [state, dispatch] = useReducer(ddiPreviewReducer, initialState);
  const requestIdRef = useRef(0);
  const versionDateRef = useRef(new Date().toISOString());

  const formatXml = useCallback((xml: string): string => {
    const PADDING = "  ";
    const reg = /(>)(<)(\/*)/g;
    let pad = 0;

    xml = xml.replace(reg, "$1\n$2$3");

    return xml
      .split("\n")
      .map((node) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/) && pad > 0) {
          pad -= 1;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }

        const padding = PADDING.repeat(pad);
        pad += indent;

        return padding + node;
      })
      .join("\n");
  }, []);

  const ddi4Data = useMemo(() => {
    const variableDDI: any = {
      "@isUniversallyUnique": "true",
      "@versionDate": versionDateRef.current,
      URN: `urn:ddi:${defaultAgencyId}:${variableId}:1`,
      Agency: defaultAgencyId,
      ID: variableId,
      Version: "1",
      VariableName: {
        String: {
          "@xml:lang": "fr-FR",
          "#text": variableName,
        },
      },
      Label: {
        Content: {
          "@xml:lang": "fr-FR",
          "#text": variableLabel,
        },
      },
    };

    if (variableDescription) {
      variableDDI.Description = {
        Content: {
          "@xml:lang": "fr-FR",
          "#text": variableDescription,
        },
      };
    }

    if (isGeographic) {
      variableDDI["@isGeographic"] = "true";
    }

    if (variableType === "numeric" && numericRepresentation) {
      variableDDI.VariableRepresentation = {
        VariableRole: "Mesure",
        NumericRepresentation: numericRepresentation,
      };
    } else if (variableType === "date" && dateRepresentation) {
      variableDDI.VariableRepresentation = {
        VariableRole: "Mesure",
        DateTimeRepresentation: dateRepresentation,
      };
    } else if (variableType === "text" && textRepresentation) {
      variableDDI.VariableRepresentation = {
        VariableRole: "Mesure",
        TextRepresentation: textRepresentation,
      };
    } else if (variableType === "code" && codeRepresentation) {
      variableDDI.VariableRepresentation = {
        VariableRole: "Mesure",
        CodeRepresentation: codeRepresentation,
      };
    }

    const data: any = {
      Variable: [variableDDI],
    };

    if (variableType === "code" && codeList) {
      data.CodeList = [codeList];
    }

    if (variableType === "code" && categories) {
      data.Category = categories;
    }

    return data;
  }, [
    defaultAgencyId,
    variableId,
    variableName,
    variableLabel,
    variableDescription,
    variableType,
    isGeographic,
    numericRepresentation,
    dateRepresentation,
    textRepresentation,
    codeRepresentation,
    codeList,
    categories,
  ]);

  const ddiJson = useMemo(() => JSON.stringify(ddi4Data, null, 2), [ddi4Data]);

  const ddi4DataSerialized = ddiJson;

  useEffect(() => {
    const currentRequestId = ++requestIdRef.current;
    dispatch({ type: "LOADING" });

    const parsedData = JSON.parse(ddi4DataSerialized);

    DDIApi.convertToDDI3(parsedData)
      .then((xml: string) => {
        if (requestIdRef.current === currentRequestId) {
          dispatch({ type: "LOAD_SUCCESS", payload: formatXml(xml) });
        }
      })
      .catch((error: unknown) => {
        console.error("Error loading DDI XML:", error);
        if (requestIdRef.current === currentRequestId) {
          dispatch({ type: "LOAD_ERROR" });
        }
      });
  }, [ddi4DataSerialized, formatXml]);

  const formatOptions = [
    { value: "DDI3" as DdiFormat, label: FORMAT_LABELS.DDI3 },
    { value: "DDI4" as DdiFormat, label: FORMAT_LABELS.DDI4 },
  ];

  return (
    <div className="flex flex-column gap-3">
      <Dropdown
        value={state.format}
        options={formatOptions}
        onChange={(e) => dispatch({ type: "SET_FORMAT", payload: e.value })}
        className="w-full"
      />

      {state.format === "DDI3" && state.isLoading && (
        <div className="flex align-items-center gap-2">
          <i className="pi pi-spin pi-spinner" />
          <span>{t("physicalInstance.view.loadingDdi")}</span>
        </div>
      )}

      {state.format === "DDI3" && !state.isLoading && state.ddiXml && (
        <DdiXmlPreview code={state.ddiXml} />
      )}

      {state.format === "DDI3" && !state.isLoading && !state.ddiXml && (
        <div className="text-center text-gray-500">{t("physicalInstance.view.noDdiXml")}</div>
      )}

      {state.format === "DDI4" && <DdiJsonPreview code={ddiJson} />}
    </div>
  );
};
