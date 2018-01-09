import React from 'react';
import { Link } from 'react-router-dom';
import conceptsLogo from '../../img/concepts.jpg';
import classificationsLogo from '../../img/classifications-temp.png';
import operationsLogo from '../../img/operations.jpg';
import { dictionary } from 'js/utils/dictionary';
import 'css/app.css';

function App() {
	return (
		<div>
			<div className="centered page-title">
				<h1>{dictionary.app.title}</h1>
			</div>
			<div className="img-block">
				<Link to="/concepts">
					<h2 className="items page-title page-title-link">
						{dictionary.app.conceptsTitle}
					</h2>
				</Link>
				{/*<Link to="/">*/}
				<h2 className="items page-title-temp" disabled>
					{dictionary.app.classificationsTitle}
				</h2>
				{/*</Link>*/}
				<Link to="/groups">
					<h2 className="items page-title page-title-link">
						{dictionary.app.sourcesTitle}
					</h2>
				</Link>
			</div>
			<div className="img-block">
				<Link to="/concepts">
					<img src={conceptsLogo} alt="Concepts" className="img" />
				</Link>
				{/*<Link to="/">*/}
				<img src={classificationsLogo} alt="Classifications" className="img" />
				{/*</Link>*/}
				<Link to="/groups">
					<img src={operationsLogo} alt="Operations" className="img" />
				</Link>
			</div>
		</div>
	);
}

export default App;
