import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { SeeButton } from "@components/buttons/see";
import { CreationUpdateItems } from "@components/creation-update-items";
import { DisseminationStatusVisualisation } from "@components/dissemination-status/disseminationStatus";
import { ErrorBloc } from "@components/errors-bloc";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationStatusItem } from "@components/status";
import {
  InseeOrganisation,
  InseeOrganisations,
} from "@components/business/organisations/organisations";

import { CodelistsApi } from "@sdk/index";

import { useTitle } from "@utils/hooks/useTitle";
import { renderMarkdownElement } from "@utils/html-utils";
import { EMPTY_ARRAY } from "@utils/array-utils";

import { getAllAttachment } from "../utils/getAllAttachment";
import { typeUriToLabel } from "../utils/typeUriToLabel";
import { XSD_CODE_LIST, XSD_TYPES, ATTRIBUTE_TYPE, MEASURE_PROPERTY_TYPE } from "../constants";
import { CodelistPanel } from "./CodelistPanel";
import { ViewMenu } from "../pages/components/view/menu";
import "./ComponentDetailView.css";
import { MeasureAttributes } from "./MeasureAttributes";
import { useAppContext } from "../../application/app-context";

export const ComponentDetailView = ({
  component,
  concepts = EMPTY_ARRAY,
  codesLists = EMPTY_ARRAY,
  handleUpdate,
  handleDelete,
  handleBack,
  updatable,
  mutualized = false,
  secondLang,
  structureComponents,
  col = 3,
  publishComponent,
  serverSideError,
  attributes,
}) => {
  const { t } = useTranslation();

  useTitle(t("component.pluralTitle"), component?.labelLg1);

  const { lg1, lg2 } = useAppContext();

  const [codesListPanelOpened, setCodesListPanelOpened] = useState(false);

  const [partialCodesLists, setPartialCodesLists] = useState([]);

  useEffect(() => {
    CodelistsApi.getCodelistsPartial().then((response) => {
      setPartialCodesLists(response);
    });
  }, []);

  const typeValue = typeUriToLabel(component.type);

  const conceptValue = concepts.find(
    (concept) => concept.id?.toString() === component.concept?.toString(),
  )?.label;

  const fullCodeLists = [
    ...codesLists,
    ...partialCodesLists.map((l) => ({
      id: l.uri,
      label: l.labelLg1,
      notation: l.id,
    })),
  ];

  const codeListValue = fullCodeLists.find(
    (codelist) => component.codeList?.toString() === codelist.id?.toString(),
  )?.label;

  const descriptionLg1 = renderMarkdownElement(component.descriptionLg1);

  const descriptionLg2 = renderMarkdownElement(component.descriptionLg2);

  const attachments = useMemo(() => {
    return getAllAttachment(structureComponents, { component });
  }, [structureComponents, component]);

  return (
    <>
      <ViewMenu
        component={component}
        handleBack={handleBack}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        publish={publishComponent}
        updatable={updatable}
        col={col}
      ></ViewMenu>
      {serverSideError && <ErrorBloc error={serverSideError} />}
      <Row>
        <Note
          text={
            <ul>
              <li>
                {t("component.notation")} : {component.identifiant}
              </li>
              <CreationUpdateItems creation={component.created} update={component.modified} />
              <PublicationStatusItem label={t("component.validationStatus")} object={component} />
              <li>
                {t("component.creator")} : <InseeOrganisation creator={component.creator} />
              </li>
              <li>
                {t("component.contributors")} :{" "}
                <InseeOrganisations creators={component.contributor} />
              </li>
              <li>
                <DisseminationStatusVisualisation
                  disseminationStatus={component.disseminationStatus}
                />
              </li>
            </ul>
          }
          title={t("component.globalInformation")}
          alone={true}
        />
      </Row>
      <Row>
        <Note text={typeValue} title={t("component.type.title")} alone={true} allowEmpty={true} />
      </Row>
      <Row>
        <Note
          text={component.altLabelLg1}
          title={t("component.shortName", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={component.altLabelLg2}
            title={t("component.shortName", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <Row>
        <Note text={conceptValue} title={t("component.concept")} alone={true} allowEmpty={true} />
      </Row>
      <Row>
        <Note
          text={
            <>
              {XSD_TYPES.find((type) => type.value === component.range)?.label}
              <ul>
                {component.pattern && (
                  <li>
                    {t("component.format")}: {component.pattern}
                  </li>
                )}
                {component.minLength && (
                  <li>
                    {t("component.minLength")}: {component.minLength}
                  </li>
                )}
                {component.maxLength && (
                  <li>
                    {t("component.maxLength")}: {component.maxLength}
                  </li>
                )}
                {component.minInclusive && (
                  <li>
                    {t("component.minValue")}: {component.minInclusive}
                  </li>
                )}
                {component.maxInclusive && (
                  <li>
                    {t("component.maxValue")}: {component.maxInclusive}
                  </li>
                )}
              </ul>
            </>
          }
          title={t("component.representation.title")}
          alone={true}
          allowEmpty={true}
        />
      </Row>
      {component.range === XSD_CODE_LIST && (
        <Row>
          <Note
            text={
              <div className="code-list-zone-view">
                {codeListValue}
                <SeeButton onClick={() => setCodesListPanelOpened(true)}></SeeButton>
              </div>
            }
            title={t("component.codelist")}
            alone={true}
            allowEmpty={true}
          />
        </Row>
      )}
      <Row>
        <Note
          text={descriptionLg1}
          title={t("component.description", { lng: "fr" }) + ` (${lg1})`}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={descriptionLg2}
            title={t("component.description", { lng: "en" }) + ` (${lg2})`}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      {component.type === MEASURE_PROPERTY_TYPE && (
        <Row>
          <Note
            text={
              <MeasureAttributes
                measure={component}
                attributes={attributes}
                codesLists={codesLists}
              />
            }
            title={t("component.type.attribute.title")}
            alone={true}
            allowEmpty={true}
          />
        </Row>
      )}
      {mutualized && component.structures?.length > 0 && (
        <Row>
          <Note
            text={
              <ul>
                {component.structures?.map((structure) => {
                  return (
                    <li key={structure.id}>
                      <Link to={`/structures/${structure.id}`}>{structure.labelLg1}</Link>
                    </li>
                  );
                })}
              </ul>
            }
            title={t("component.stucturesUsingComponent")}
            alone={true}
            allowEmpty={true}
          />
        </Row>
      )}
      {component.type === ATTRIBUTE_TYPE && !mutualized && (
        <>
          <hr />
          <h4>{t("component.componentSpecification")}</h4>
          <Row>
            <Note
              text={
                <ul>
                  {component.attachment?.map((attachment) => {
                    return (
                      <li key={attachment}>
                        {attachments.find((type) => type.value === attachment)?.label}
                      </li>
                    );
                  })}
                </ul>
              }
              title={t("component.attachment")}
              alone={true}
              allowEmpty={true}
            />
          </Row>
          <Row>
            <Note
              text={component.required ? t("yes") : t("no")}
              title={t("component.requiredSpecification")}
              alone={true}
              allowEmpty={true}
            />
          </Row>
        </>
      )}
      <CodelistPanel
        codesList={fullCodeLists.find(
          (c) => (component.codeList?.id || component.codeList)?.toString() === c.id?.toString(),
        )}
        isOpen={codesListPanelOpened}
        handleBack={() => setCodesListPanelOpened(false)}
      />
    </>
  );
};
