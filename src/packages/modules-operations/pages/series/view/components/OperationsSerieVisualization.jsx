import { CreationUpdateItems } from "@components/creation-update-items";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationStatusItem } from "@components/status";

import { useTitle } from "@utils/hooks/useTitle";
import { renderMarkdownElement } from "@utils/html-utils";

import { D1, D2 } from "../../../../../deprecated-locales";
import D from "../../../../../deprecated-locales/build-dictionary";
import { DisplayLinks } from "../../../../components/DisplayLinks";
import { getSeeAlsoByType } from "../../../../utils/getSeeAlsoByType";
import { RelationsView } from "../../../../components/RelationsView";
import { SeeAlso } from "../../../../components/SeeAlso";
import { InseeOrganisationNotes } from "@components/business/creators-view";

export function OperationsSerieVisualization({ attr, secondLang, frequency = {}, category = {} }) {
  useTitle(D.seriesTitle + " - " + D.operationsTitle, attr?.prefLabelLg1);
  const seeAlso = getSeeAlsoByType(attr.seeAlso);
  return (
    <>
      <Row>
        <Note
          text={
            <ul>
              <CreationUpdateItems creation={attr.created} update={attr.modified} />
              <PublicationStatusItem label={D1.seriesStatus} object={attr} gender="female" />
            </ul>
          }
          title={D1.globalInformationsTitle}
          alone={true}
        />
      </Row>
      <Row>
        <Note text={attr.altLabelLg1} title={D1.altLabel} alone={!secondLang} allowEmpty={true} />
        {secondLang && (
          <Note text={attr.altLabelLg2} title={D2.altLabel} alone={false} allowEmpty={true} />
        )}
      </Row>
      <Row>
        <Note
          text={renderMarkdownElement(attr.abstractLg1)}
          title={D1.summary}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={renderMarkdownElement(attr.abstractLg2)}
            title={D2.summary}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>

      <Row>
        <Note
          text={renderMarkdownElement(attr.historyNoteLg1)}
          title={D1.history}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={renderMarkdownElement(attr.historyNoteLg2)}
            title={D2.history}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>

      <Row>
        <Note
          text={category.labelLg1}
          title={D1.operationType}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note text={category.labelLg2} title={D2.operationType} alone={false} allowEmpty={true} />
        )}
      </Row>

      <Row>
        <Note
          text={frequency.labelLg1}
          title={D1.dataCollectFrequency}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={frequency.labelLg2}
            title={D2.dataCollectFrequency}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>

      <Row id="publishers">
        <InseeOrganisationNotes
          organisations={attr.publishers?.map((p) => p?.id ?? p)}
          title={D1.organisation}
        />
      </Row>

      <Row id="contributors">
        <InseeOrganisationNotes
          organisations={attr.contributors?.map((c) => c?.id ?? c)}
          title={D1.stakeholders}
        />
      </Row>
      <Row id="dataCollectors">
        <InseeOrganisationNotes
          organisations={attr.dataCollectors?.map((c) => c?.id ?? c)}
          title={D1.dataCollector}
        />
      </Row>

      <Row id="creators">
        <InseeOrganisationNotes organisations={attr.creators} />
      </Row>
      <DisplayLinks
        links={attr.replaces}
        path="/operations/series/"
        title="replaces"
        secondLang={secondLang}
      />
      <DisplayLinks
        links={attr.isReplacedBy}
        path="/operations/series/"
        title="replacedBy"
        secondLang={secondLang}
      />
      <DisplayLinks
        links={attr.generate}
        path="/operations/indicator/"
        title="indicators"
        secondLang={secondLang}
      />

      <SeeAlso links={seeAlso} secondLang={secondLang} />

      <RelationsView
        children={attr.operations}
        childrenTitle="childrenOperations"
        childrenPath="operation"
        parent={attr.family}
        parentTitle="parentFamilly"
        parentPath="family"
        title="linksTitle"
        secondLang={secondLang}
      />
    </>
  );
}
