import { CheckSecondLang } from "@components/check-second-lang";
import { PageTitleBlock } from "@components/page-title-block";

import { Component } from "@model/structures/Component";

interface ComponentTitleTypes {
  component?: Component;
}

export const ComponentTitle = ({ component }: Readonly<ComponentTitleTypes>) => {
  return (
    <>
      <PageTitleBlock titleLg1={component?.labelLg1} titleLg2={component?.labelLg2} />
      <CheckSecondLang />
    </>
  );
};
