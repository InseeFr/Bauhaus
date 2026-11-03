import { useQueries } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { TextInput } from "@components/form/input";
import { Column, Row } from "@components/layout";
import { Select } from "@components/select-rmes";

import { Component, ComponentDefinition } from "@model/structures/Component";

import { ATTRIBUTE_PROPERTY_TYPE, MEASURE_PROPERTY_TYPE } from "../constants/dsd-components";
import { mutualizedComponentQuery } from "../hooks/queries";
import { getAllAttachment } from "../utils/getAllAttachment";
import "./ComponentSpecificationForm.css";

export interface ComponentSpecification {
  notation?: string;
  labelLg1?: string;
  labelLg2?: string;
  attachment?: string[];
  required?: boolean;
}

interface ComponentSpecificationFormTypes {
  structureComponents: ComponentDefinition[];
  selectedComponent: ComponentDefinition;
  component: ComponentSpecification;
  onChange: (component: ComponentSpecification) => void;
  disabled?: boolean;
}

export const ComponentSpecificationForm = ({
  structureComponents,
  selectedComponent,
  component,
  onChange,
  disabled = false,
}: Readonly<ComponentSpecificationFormTypes>) => {
  const { t } = useTranslation();

  // Les attributs liés d'une mesure ne figurent que sur sa fiche : une lecture par mesure.
  const attachments = useQueries({
    queries: structureComponents
      .filter((c) => c.component.type === MEASURE_PROPERTY_TYPE)
      .map((measure) => mutualizedComponentQuery(measure.component.id!)),
    combine: (results) =>
      results.every((result) => result.isSuccess)
        ? getAllAttachment(
            results.map((result) => result.data as Component),
            selectedComponent,
          )
        : [],
  });

  return (
    <>
      <Row>
        <div className="col-12">
          <label htmlFor="component-specification-notation">{t("component.notation")}</label>
          <TextInput
            value={component.notation}
            name="component-specification-notation"
            id="component-specification-notation"
            onChange={(e) => {
              onChange({
                ...component,
                notation: e.target.value,
              });
            }}
            disabled={disabled}
          />
        </div>
      </Row>
      <Row>
        <Column>
          <label htmlFor="component-specification-labelLg1">
            {t("component.label", { lng: "fr" })}
          </label>
          <TextInput
            value={component.labelLg1}
            name="component-specification-labelLg1"
            id="component-specification-labelLg1"
            onChange={(e) => {
              onChange({
                ...component,
                labelLg1: e.target.value,
              });
            }}
            disabled={disabled}
          />
        </Column>
        <Column>
          <label htmlFor="component-specification-labelLg2">
            {t("component.label", { lng: "en" })}
          </label>
          <TextInput
            value={component.labelLg2}
            name="component-specification-labelLg2"
            id="component-specification-labelLg2"
            onChange={(e) => {
              onChange({
                ...component,
                labelLg2: e.target.value,
              });
            }}
            disabled={disabled}
          />
        </Column>
      </Row>
      {selectedComponent.component.type === ATTRIBUTE_PROPERTY_TYPE && (
        <>
          <Row className="bauhaus-component-specification-form">
            <label className="col-12">
              {t("component.attachment")}
              <Select
                placeholder={t("component.attachment")}
                value={attachments.filter((c) =>
                  component.attachment?.some((a) => a.includes(c.value)),
                )}
                multi
                options={attachments}
                onChange={(value) => {
                  onChange({
                    ...component,
                    attachment: value,
                  });
                }}
                disabled={disabled}
              />
            </label>
          </Row>
          <Row>
            <fieldset className="col-12 checkbox">
              <legend>{t("component.requiredSpecification")}</legend>
              <label className="radio-inline">
                <input
                  type="radio"
                  checked={component.required}
                  name="required"
                  onChange={() => {
                    onChange({
                      ...component,
                      required: true,
                    });
                  }}
                  disabled={disabled}
                />
                {t("yes")}
              </label>
              <label className="radio-inline">
                <input
                  type="radio"
                  checked={!component.required}
                  name="required"
                  onChange={() => {
                    onChange({
                      ...component,
                      required: false,
                    });
                  }}
                  disabled={disabled}
                />
                {t("no")}
              </label>
            </fieldset>
          </Row>
        </>
      )}
    </>
  );
};
