import React from 'react';
import { Link } from 'react-router-dom';
import { dictionary } from 'js/utils/dictionary';
import homeLogo from '../../img/accueil.png';
import conceptsLogo from '../../img/concepts.jpg';
import nomenclaturesLogo from '../../img/nomenclatures.jpg';
import sourcesLogo from '../../img/sources.jpg';
import 'css/menu-referentiels.css';

function MenuReferentiels() {
  return (
    <div>
      <header>
        <nav className="navbar navbar-default navbar-default-ref">
          <div className="container-fluid">
            <div className="collapse navbar-collapse">
              <ul className="nav navbar-nav navbar-nav-ref">
                <li>
                  <Link to="/">
                    <img
                      src={homeLogo}
                      alt="Accueil"
                      className="img-menu"
                    />{' '}
                    {dictionary.navbar.referenciels.home}
                  </Link>
                </li>
                <li>
                  <Link to="/concepts">
                    <img
                      src={conceptsLogo}
                      alt="Concepts"
                      className="img-menu"
                    />{' '}
                    {dictionary.navbar.referenciels.concepts}
                  </Link>
                </li>
                <li>
                  <Link to="/classifications">
                    <img
                      src={nomenclaturesLogo}
                      alt="Nomenclatures"
                      className="img-menu"
                    />{' '}
                    {dictionary.navbar.referenciels.classifications}
                  </Link>
                </li>
                <li>
                  <Link to="/sources">
                    <img
                      src={sourcesLogo}
                      alt="Sources"
                      className="img-menu"
                    />{' '}
                    {dictionary.navbar.referenciels.sources}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default MenuReferentiels;
