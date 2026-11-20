import { useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { componentsI18n } from "@components/i18n";
import { Row } from "@components/layout";
import { Panel } from "@components/panel";
import { Select } from "@components/select-rmes";

import { cx } from "@utils/cx";
import { renderMarkdownElement } from "@utils/html-utils";

import { buildNotes } from "../../../../utils/buildNotes";

type NotesByVersion = Record<string, Record<string, any>>;

interface NoteVersion {
  version: number;
  lg1?: string;
  lg2?: string;
}

/**
 * Chaque type de note a ses propres numéros de version : pour un type donné,
 * on ne garde que les versions qui portent un contenu, triées.
 */
const versionsByNoteType = (notes: NotesByVersion) => {
  const sorted = Object.values(notes).sort((a, b) => Number(a.version) - Number(b.version));

  return buildNotes({}).map(({ title }, index) => ({
    title,
    versions: sorted
      .map((notesOfVersion) => ({
        version: Number(notesOfVersion.version),
        ...buildNotes(notesOfVersion)[index],
      }))
      .filter((note) => !!note.lg1 || !!note.lg2),
  }));
};

const VersionSide = ({
  versions,
  selected,
  onSelect,
  secondLang,
}: Readonly<{
  versions: NoteVersion[];
  selected: number;
  onSelect?: (version: number) => void;
  secondLang: boolean;
}>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });
  const inputId = useId();
  const note = versions.find(({ version }) => version === selected);
  const text = secondLang ? note?.lg2 : note?.lg1;

  // Pas de `Note` ici : elle ajoute sa propre colonne, dont le retrait décalerait
  // le bloc par rapport au titre de la section et à la liste des versions.
  return (
    <div className={cx("col-12 flex flex-column gap-2", onSelect && "lg:col-6")}>
      {onSelect && (
        <div>
          <label htmlFor={inputId}>{t("version")}</label>
          <Select
            inputId={inputId}
            unclearable
            searchable={false}
            options={versions.map(({ version }) => ({ value: `${version}`, label: `${version}` }))}
            value={`${selected}`}
            onChange={(value) => onSelect(Number(value))}
          />
        </div>
      )}
      <Panel title={`${t("version")} ${selected}`}>{text && renderMarkdownElement(text)}</Panel>
    </div>
  );
};

const NoteTypeCompare = ({
  title,
  versions,
  secondLang,
}: Readonly<{ title: string; versions: NoteVersion[]; secondLang: boolean }>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });
  const titleId = useId();
  const last = versions.at(-1)!.version;
  const beforeLast = versions.at(-2)?.version;

  const [left, setLeft] = useState(beforeLast ?? last);
  const [right, setRight] = useState(last);

  return (
    <section aria-labelledby={titleId}>
      <h2 id={titleId}>{t(title)}</h2>
      <Row>
        {beforeLast === undefined ? (
          <VersionSide versions={versions} selected={last} secondLang={secondLang} />
        ) : (
          <>
            <VersionSide
              versions={versions}
              selected={left}
              onSelect={setLeft}
              secondLang={secondLang}
            />
            <VersionSide
              versions={versions}
              selected={right}
              onSelect={setRight}
              secondLang={secondLang}
            />
          </>
        )}
      </Row>
    </section>
  );
};

export const ItemNotesCompare = ({
  notes,
  secondLang,
}: Readonly<{ notes: NotesByVersion; secondLang: boolean }>) => (
  <div>
    {versionsByNoteType(notes)
      .filter(({ versions }) => versions.length > 0)
      .map(({ title, versions }) => (
        <NoteTypeCompare key={title} title={title} versions={versions} secondLang={secondLang} />
      ))}
  </div>
);
