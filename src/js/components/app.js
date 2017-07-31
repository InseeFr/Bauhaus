import React from 'react';
import { Link } from 'react-router-dom';
import conceptsLogo from '../../img/concepts.jpg';
import nomenclaturesLogo from '../../img/nomenclatures.jpg';
import sourcesLogo from '../../img/sources.jpg';
import { dictionary } from 'js/utils/dictionary';
import 'css/app.css';

function App() {
	return (
		<div>
			<div className="centered page-title">
				<h1>
					{dictionary.app.title}
				</h1>
			</div>
			<div className="img-block">
				<Link to="/concepts">
					<h2 className="items page-title page-title-link">
						{dictionary.app.conceptsTitle}
					</h2>
				</Link>
				<Link to="/">
					<h2 className="items page-title page-title-link">
						{dictionary.app.classificationsTitle}
					</h2>
				</Link>
				<Link to="/">
					<h2 className="items page-title page-title-link">
						{dictionary.app.sourcesTitle}
					</h2>
				</Link>
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
