import { useMutation, useQueryClient } from "@tanstack/react-query";
import Editor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Organisation, Organisations } from "@components/business/organisations/organisations";
import { CheckSecondLang } from "@components/check-second-lang";
import { CodeDisplay } from "@components/code-display";
import { DisseminationStatusVisualisation } from "@components/dissemination-status/disseminationStatus";
import { ErrorBloc } from "@components/errors-bloc";
import { Row } from "@components/layout";
import { List } from "@components/ui/list";
import { Deleting, Loading, Publishing } from "@components/loading";
import { Note } from "@components/note";
import { PageTitleBlock } from "@components/page-title-block";

import { DatasetsApi } from "@sdk/index";

import { withCodesLists } from "@utils/hoc/withCodesLists";
import { useSecondLang } from "@utils/hooks/second-lang";
import { useTitle } from "@utils/hooks/useTitle";

import { CL_PROCESS_STEP } from "../../../../constants/code-lists";
import { GlobalInformationBlock } from "./components/GlobalInformationBlock";
import { StatisticalInformations } from "./components/StatisticalInformations";
import { ViewMenu } from "./menu";
import { useOrganizations } from "@utils/hooks/organizations";
import { useDataset } from "../../../hooks/useDataset";

const Dataset = (props) => {
  const { t } = useTranslation();

  const { id } = useParams();

  const navigate = useNavigate();

  const [archivageUnits, setArchivageUnits] = useState([]);

  const { data: organisationsList } = useOrganizations();

  useEffect(() => {
    DatasetsApi.getArchivageUnits().then(setArchivageUnits);
  }, []);

  const { data: dataset, isLoading } = useDataset(id);

  const [secondLang] = useSecondLang();

  const queryClient = useQueryClient();

  const {
    isPending: isPublishing,
    mutate: publish,
    error: publishServerSideError,
  } = useMutation({
    mutationFn: () => {
      return DatasetsApi.publish(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["datasets", id]);
    },
  });

  const {
    isPending: isDeleting,
    mutate: remove,
    error: serverSideError,
  } = useMutation({
    mutationFn: () => {
      return DatasetsApi.deleteDataset(id);
    },
    onSuccess: (id) => {
      return Promise.all([
        queryClient.removeQueries(["datasets", id]),
        queryClient.invalidateQueries(["datasets"]),
      ]).then(() => navigate("/datasets"));
    },
  });

  useTitle(t("dataset.pluralTitle"), dataset?.labelLg1);

  if (isLoading) return <Loading />;
  if (isDeleting) return <Deleting />;
  if (isPublishing) return <Publishing />;

  return (
    <div className="container">
      <PageTitleBlock titleLg1={dataset.labelLg1} titleLg2={dataset.labelLg2} />
      <ViewMenu dataset={dataset} {...props} onPublish={publish} onDelete={remove} />
      {(serverSideError || publishServerSideError) && (
        <ErrorBloc error={[serverSideError || publishServerSideError]} />
      )}
      <CheckSecondLang />
      <GlobalInformationBlock dataset={dataset}></GlobalInformationBlock>
      <Row>
        <Note
          text={dataset.subTitleLg1}
          title={t("dataset.globalInformation.subtitle", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={dataset.subTitleLg2}
            title={t("dataset.globalInformation.subtitle", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <Row>
        <Note
          text={dataset.landingPageLg1}
          title={t("dataset.globalInformation.landingPage", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={dataset.landingPageLg2}
            title={t("dataset.globalInformation.landingPage", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <Row>
        <Note
          text={
            <List
              items={dataset.linkedDocuments}
              getContent={(linkedDocument) => <a href={linkedDocument}>{linkedDocument}</a>}
            ></List>
          }
          title={t("dataset.globalInformation.linkedDocuments", { lng: "fr" })}
          alone={true}
          allowEmpty={true}
        ></Note>
      </Row>
      <Row>
        <Note
          text={
            <ul>
              <li>
                {t("dataset.internalManagement.creator")} :{" "}
                <Organisation
                  creator={dataset.catalogRecord?.creator}
                  organizations={organisationsList}
                />
              </li>
              <li>
                {t("dataset.internalManagement.contributors")} :{" "}
                <Organisations
                  creators={dataset.catalogRecord?.contributor}
                  organizations={organisationsList}
                />
              </li>
              <li>
                <DisseminationStatusVisualisation
                  disseminationStatus={dataset.disseminationStatus}
                />
              </li>
              {dataset.processStep && (
                <li>
                  {t("dataset.internalManagement.processStep")} :{" "}
                  <CodeDisplay
                    codesList={props[CL_PROCESS_STEP]}
                    value={dataset.processStep}
                  ></CodeDisplay>
                </li>
              )}
              {dataset.archiveUnit && (
                <li>
                  {t("dataset.internalManagement.archiveUnit")} :{" "}
                  {archivageUnits?.find((t) => t.value === dataset.archiveUnit)?.label}
                </li>
              )}
            </ul>
          }
          title={t("dataset.internalManagement.title")}
          alone={true}
        />
      </Row>
      <Row>
        <Note
          text={<Editor.Markdown source={dataset.descriptionLg1} />}
          title={t("dataset.notes.description", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={<Editor.Markdown source={dataset.descriptionLg2} />}
            title={t("dataset.notes.description", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <Row>
        <Note
          text={<Editor.Markdown source={dataset.abstractLg1} />}
          title={t("dataset.notes.abstract", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={<Editor.Markdown source={dataset.abstractLg2} />}
            title={t("dataset.notes.abstract", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <Row>
        <Note
          text={<Editor.Markdown source={dataset.cautionLg1} />}
          title={t("dataset.notes.warning", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={<Editor.Markdown source={dataset.cautionLg2} />}
            title={t("dataset.notes.warning", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <StatisticalInformations dataset={dataset}></StatisticalInformations>
    </div>
  );
};

export const Component = withCodesLists([CL_PROCESS_STEP])(Dataset);
