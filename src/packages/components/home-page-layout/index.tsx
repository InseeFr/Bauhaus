import { ReactNode } from "react";

import { Row } from "@components/layout";
import { PageTitle } from "@components/page-title";

import "./index.css";

interface HomePageLayoutProps {
  title: string;
  /**
   * Le menu de gauche, en général un `VerticalMenu`. Sans menu, sa place reste vide : le titre et
   * la liste restent alignés sur ceux des autres pages d'accueil.
   */
  menu?: ReactNode;
  children: ReactNode;
}

/** Mise en page commune aux pages d'accueil : le menu à gauche, le titre et le contenu à droite. */
export const HomePageLayout = ({ title, menu, children }: Readonly<HomePageLayoutProps>) => (
  <div className="container home-page-layout">
    <Row>
      {menu}
      <div className="col-md-8 text-center pull-right home-page-layout__content">
        <PageTitle title={title} col={12} offset={0} />
        {children}
      </div>
    </Row>
  </div>
);
