import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ClientSideError } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import { Row } from "@components/layout";
import { List } from "@components/ui/list-group";

import { Link } from "@model/concepts/concept";

import { CLOSE_MATCH } from "@sdk/constants";

import "./EquivalentLinks.css";
import { EMPTY_ARRAY } from "@utils/array-utils";
import { isAbsoluteUri } from "@utils/uri";

interface EquivalentLinksTypes {
  links: (Link & { urn: string })[];
  updateEquivalentLinks: (links: (Link | { urn: string })[]) => void;
}

export const EquivalentLinks = ({
  links = EMPTY_ARRAY,
  updateEquivalentLinks,
}: Readonly<EquivalentLinksTypes>) => {
  const { t } = useTranslation();

  const [value, setValue] = useState("");

  const uri = value.trim();

  const isValid = isAbsoluteUri(uri);

  // Rien à reprocher à un champ encore vide.
  const error = uri && !isValid ? t("concept.links.invalidUri") : undefined;

  return (
    <div className="equivalent-links">
      <Row>
        <div className="col-md-12">
          <div className="form-group">
            <TextInput
              placeholder={t("concept.edit.btnNewLink")}
              aria-label={t("concept.edit.btnNewLink")}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <ClientSideError id="equivalent-link-error" error={error} />
          </div>
          <button
            type="button"
            disabled={!isValid}
            onClick={() => {
              updateEquivalentLinks([
                ...links,
                {
                  urn: uri,
                  prefLabelLg1: uri,
                  prefLabelLg2: uri,
                  typeOfLink: CLOSE_MATCH,
                },
              ]);
              setValue("");
            }}
          >
            {t("common.btnAdd")}
          </button>
        </div>
      </Row>
      <ul>
        {links.map((link) => {
          return (
            <List.Item key={link.urn}>
              <span>{link.urn}</span>
              <button
                type="button"
                aria-label={t("common.btnDelete")}
                onClick={() => {
                  updateEquivalentLinks(links.filter(({ urn }) => urn !== link.urn));
                }}
              >
                <span className="glyphicon glyphicon-trash" aria-hidden="true" />
              </button>
            </List.Item>
          );
        })}
      </ul>
    </div>
  );
};
