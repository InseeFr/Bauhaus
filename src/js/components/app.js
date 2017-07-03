import React from 'react';
import { Link } from 'react-router';
import conceptsLogo from '../../img/concepts.jpg';
import nomenclaturesLogo from '../../img/nomenclatures.jpg';
import sourcesLogo from '../../img/sources.jpg';
import { dictionary } from '../utils/dictionary';
import '../../css/app.css';

function App() {
  return (
    <div>
      <div className="centered">
        <h1>
          {dictionary.app.title}
        </h1>
      </div>
      <div className="img-block">
        <h2 className="items">
          <Link to="/concepts">
            {dictionary.app.conceptsTitle}
          </Link>
        </h2>
        <h2 className="items">
          <Link to="/">
            {dictionary.app.classificationsTitle}
          </Link>
        </h2>
        <h2 className="items">
          <Link to="/">
            {dictionary.app.sourcesTitle}
          </Link>
        </h2>
      </div>
      <div className="img-block">
        <Link to="/concepts">
          <img src={conceptsLogo} alt="Concepts" className="img" />
        </Link>
        <Link to="/">
          <img src={nomenclaturesLogo} alt="Nomenclatures" className="img" />
        </Link>
        <Link to="/">
          <img src={sourcesLogo} alt="Sources" className="img" />
        </Link>
      </div>
    </div>
  );
}

export default App;
