import React from 'react';
import { Link } from 'react-router-dom';
import conceptsLogo from 'img/concepts.jpg';
import classificationsLogo from 'img/classifications.jpg';
import operationsLogo from 'img/operations.jpg';
import D from 'js/i18n';

function App() {
	document.title = 'Bauhaus';

	return (
		<React.Fragment>
			<div className="centered page-title">
				<h1>{D.welcome}</h1>
			</div>
			<ul className="home-page-links">
				<li>
					<Link to="/concepts">
						<h2 className="items page-title page-title-link">
							{D.conceptsTitle}
						</h2>
						<img src={conceptsLogo} alt="Concepts" />
					</Link>
				</li>
				<li>
					<Link to="/classifications">
						<h2 className="items page-title page-title-link" disabled>
							{D.classificationsTitle}
						</h2>
						<img src={classificationsLogo} alt="Classifications" />
					</Link>
				</li>
				{/* <li>
					<Link to="/operations/series">
						<h2 className="items page-title page-title-link">
							{D.operationsTitle}
						</h2>
						<img src={operationsLogo} alt="Operations" />
					</Link>
				</li> */}
			</ul>
		</React.Fragment>
	);
}

export default App;
