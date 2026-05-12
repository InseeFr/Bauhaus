import { useState } from "react";
import { useTranslation } from "react-i18next";

import { TextInput } from "@components/form/input";
import { Row } from "@components/layout";

import { CLOSE_MATCH } from "@sdk/constants";

import { Link } from "../../../../../../model/concepts/concept";
import "./equivalentLinks.scss";
import { EMPTY_ARRAY } from "@utils/array-utils";

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
  return (
    <div className="equivalentLinks">
      <Row>
        <div className="col-md-12">
          <div className="form-group">
            <TextInput
              placeholder={t("concept.edit.btnNewLink")}
              aria-label={t("concept.edit.btnNewLink")}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              updateEquivalentLinks([
                ...links,
                {
                  urn: value,
                  prefLabelLg1: value,
                  prefLabelLg2: value,
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
            <li key={link.urn} className="list-group-item">
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
            </li>
          );
        })}
      </ul>
    </div>
  );
};
