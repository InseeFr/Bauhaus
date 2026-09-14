import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { TextInput } from "@components/form/input";
import { Column, Row } from "@components/layout";
import { Select } from "@components/select-rmes";

import { Options } from "@model/SelectOption";
import { ComponentDefinition } from "@model/structures/Component";

import { StructureApi } from "@sdk/index";

import { ATTRIBUTE_PROPERTY_TYPE, MEASURE_PROPERTY_TYPE } from "../constants";
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

  const [attachments, setAttachments] = useState<Options>([]);

  useEffect(() => {
    Promise.all(
      structureComponents
        .filter((c) => c.component.type === MEASURE_PROPERTY_TYPE)
        .map((measure) => StructureApi.getMutualizedComponent(measure.component.id)),
    ).then((measures) => {
      setAttachments(getAllAttachment(measures, selectedComponent));
    });
  }, [structureComponents, selectedComponent]);

  return (
    <>
      <Row>
        <div className="col-md-12">
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
          <div className="row bauhaus-component-specification-form">
            <label className="col-md-12">
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
          </div>
          <Row>
            <fieldset className="col-md-12 checkbox ">
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
