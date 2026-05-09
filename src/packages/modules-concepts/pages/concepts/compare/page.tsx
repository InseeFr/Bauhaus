import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Loading } from "@components/loading";

import { ConceptGeneral, ConceptNotes } from "../../../../model/concepts/concept";
import { ConceptsApi } from "../../../../sdk";
import { range } from "../../../../utils/array-utils";
import { useSecondLang } from "../../../../utils/hooks/second-lang";
import { rmesHtmlToRawHtml } from "../../../../utils/html-utils";
import { emptyNotes } from "../../../utils/notes";
import ConceptCompare from "./components/home";

type VersionedNotes = Record<number, ConceptNotes>;

const EMPTY_GENERAL = {} as ConceptGeneral;

export const Component = () => {
  const { id } = useParams<{ id: string }>();
  const [secondLang] = useSecondLang();
  const [loading, setLoading] = useState(true);

  const [general, setGeneral] = useState<ConceptGeneral>(EMPTY_GENERAL);
  const [notes, setNotes] = useState<VersionedNotes>({});

  useEffect(() => {
    if (!id) return;
    ConceptsApi.getConceptGeneral(id)
      .then((results: ConceptGeneral) => {
        setGeneral(results);
        return results;
      })
      .then((generalResult: ConceptGeneral) => {
        const { conceptVersion } = generalResult;
        return Promise.all(
          range(1, Number(conceptVersion) + 1).map((version: number) =>
            ConceptsApi.getNoteVersionList(id, String(version)).then(
              (versionNotes: Partial<ConceptNotes>) => [version, versionNotes] as const,
            ),
          ),
        )
          .then((notesAndVersions) => {
            setNotes(
              notesAndVersions.reduce<VersionedNotes>((acc, [version, versionNotes]) => {
                const formatted = (Object.keys(versionNotes) as (keyof ConceptNotes)[]).reduce<
                  Partial<ConceptNotes>
                >((mapped, noteName) => {
                  mapped[noteName] = rmesHtmlToRawHtml(versionNotes[noteName] ?? "");
                  return mapped;
                }, {});
                return {
                  ...acc,
                  [version]: {
                    ...(emptyNotes as unknown as ConceptNotes),
                    ...formatted,
                  },
                };
              }, {}),
            );
          })
          .finally(() => setLoading(false));
      });
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  return <ConceptCompare conceptGeneral={general} notes={notes} secondLang={secondLang} />;
};
