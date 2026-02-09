import { useMutation, useQueryClient } from "@tanstack/react-query";
import Editor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

import D, { D1, D2 } from "../../../deprecated-locales/build-dictionary";
import { CL_PROCESS_STEP } from "../../../constants/code-lists";
import { useDataset } from "../../datasets";
import { D as DatasetDictionary } from "../../i18n";
import { GlobalInformationBlock } from "./GlobalInformationBlock";
import { StatisticalInformations } from "./StatisticalInformations";
import { ViewMenu } from "./menu";
import { useOrganizations } from "@utils/hooks/organizations";
import { Organisation, Organisations } from "@components/business/organisations/organisations";

const Dataset = (props) => {
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

  useTitle(D.datasetsTitle, dataset?.labelLg1);

  if (isLoading) return <Loading />;
  if (isDeleting) return <Deleting />;
  if (isPublishing) return <Publishing />;

  return (
    <div className="container">
      <PageTitleBlock titleLg1={dataset.labelLg1} titleLg2={dataset.labelLg2} />

      <ViewMenu dataset={dataset} {...props} onPublish={publish} onDelete={remove} />
      {(serverSideError || publishServerSideError) && (
        <ErrorBloc error={[serverSideError || publishServerSideError]} D={DatasetDictionary} />
      )}

      <CheckSecondLang />

      <GlobalInformationBlock dataset={dataset}></GlobalInformationBlock>

      <Row>
        <Note
          text={dataset.subTitleLg1}
          title={D1.datasetsSubtitle}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={dataset.subTitleLg2}
            title={D2.datasetsSubtitle}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <Row>
        <Note
          text={dataset.landingPageLg1}
          title={D1.datasetsLandingPage}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={dataset.landingPageLg2}
            title={D2.datasetsLandingPage}
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
          title={DatasetDictionary.datasets.linkedDocuments}
          alone={true}
          allowEmpty={true}
        ></Note>
      </Row>
      <Row>
        <Note
          text={
            <ul>
              <li>
                {D.creatorTitle} :{" "}
                <Organisation
                  creator={dataset.catalogRecord?.creator}
                  organizations={organisationsList}
                />
              </li>
              <li>
                {D.contributorTitle} :{" "}
                <Organisations
                  creators={dataset.catalogRecord?.contributor}
                  organizations={organisationsList}
                />{" "}
              </li>

              <li>
                <DisseminationStatusVisualisation
                  disseminationStatus={dataset.disseminationStatus}
                />
              </li>
              {dataset.processStep && (
                <li>
                  {D.datasetProcessStep} :{" "}
                  <CodeDisplay
                    codesList={props[CL_PROCESS_STEP]}
                    value={dataset.processStep}
                  ></CodeDisplay>
                </li>
              )}
              {dataset.archiveUnit && (
                <li>
                  {D.datasetsArchiveUnit} :{" "}
                  {archivageUnits?.find((t) => t.value === dataset.archiveUnit)?.label}
                </li>
              )}
            </ul>
          }
          title={D1.internalManagementTitle}
          alone={true}
        />
      </Row>

      <Row>
        <Note
          text={<Editor.Markdown source={dataset.descriptionLg1} />}
          title={D1.descriptionTitle}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={<Editor.Markdown source={dataset.descriptionLg2} />}
            title={D2.descriptionTitle}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <Row>
        <Note
          text={<Editor.Markdown source={dataset.abstractLg1} />}
          title={D1.datasetsAbstract}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={<Editor.Markdown source={dataset.abstractLg2} />}
            title={D2.datasetsAbstract}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <Row>
        <Note
          text={<Editor.Markdown source={dataset.cautionLg1} />}
          title={D1.datasetsCaution}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={<Editor.Markdown source={dataset.cautionLg2} />}
            title={D2.datasetsCaution}
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
